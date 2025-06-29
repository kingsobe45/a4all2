import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { validateRegister, validateLogin } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Register new user
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await db.getAsync(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email or username already exists',
        code: 'USER_EXISTS'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    const defaultAvatar = `https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`;

    await db.runAsync(
      `INSERT INTO users (id, username, email, password_hash, avatar) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, username, email, passwordHash, defaultAvatar]
    );

    // Create JWT token
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Store session
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await db.runAsync(
      'INSERT INTO user_sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
      [sessionId, userId, token, expiresAt.toISOString()]
    );

    // Get user data
    const user = await db.getAsync(
      'SELECT id, username, email, avatar, xp, level, followers_count, following_count, is_verified, is_premium FROM users WHERE id = ?',
      [userId]
    );

    // Get user badges
    const badges = await db.allAsync(
      'SELECT badge_name FROM user_badges WHERE user_id = ?',
      [userId]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          ...user,
          badges: badges.map(b => b.badge_name)
        },
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// Login user
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Get user
    const user = await db.getAsync(
      'SELECT * FROM users WHERE email = ? AND status = "active"',
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Store session
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await db.runAsync(
      'INSERT INTO user_sessions (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)',
      [sessionId, user.id, token, expiresAt.toISOString()]
    );

    // Update last login
    await db.runAsync(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Get user badges
    const badges = await db.allAsync(
      'SELECT badge_name FROM user_badges WHERE user_id = ?',
      [user.id]
    );

    // Remove sensitive data
    const { password_hash, ...userData } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          ...userData,
          badges: badges.map(b => b.badge_name)
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
});

// Logout user
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Remove session
    await db.runAsync(
      'DELETE FROM user_sessions WHERE user_id = ? AND token_hash = ?',
      [req.user.id, token]
    );

    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    // Create new JWT token
    const token = jwt.sign({ userId: req.user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Update session
    const sessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    await db.runAsync(
      'UPDATE user_sessions SET token_hash = ?, expires_at = ? WHERE user_id = ?',
      [token, expiresAt.toISOString(), req.user.id]
    );

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { token }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed',
      code: 'TOKEN_REFRESH_ERROR'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Get user badges
    const badges = await db.allAsync(
      'SELECT badge_name FROM user_badges WHERE user_id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      data: {
        user: {
          ...req.user,
          badges: badges.map(b => b.badge_name)
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user data',
      code: 'GET_USER_ERROR'
    });
  }
});

export default router;