import jwt from 'jsonwebtoken';
import { db } from '../database/init.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
        code: 'TOKEN_REQUIRED'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if session exists and is valid
    const session = await db.getAsync(
      'SELECT * FROM user_sessions WHERE user_id = ? AND token_hash = ? AND expires_at > datetime("now")',
      [decoded.userId, token]
    );

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        code: 'TOKEN_INVALID'
      });
    }

    // Get user data
    const user = await db.getAsync(
      'SELECT id, username, email, avatar, xp, level, is_verified, is_premium, status FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive',
        code: 'USER_NOT_FOUND'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'TOKEN_INVALID'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
      code: 'AUTH_ERROR'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.getAsync(
      'SELECT id, username, email, avatar, xp, level, is_verified, is_premium FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export const requirePremium = (req, res, next) => {
  if (!req.user?.is_premium) {
    return res.status(403).json({
      success: false,
      error: 'Premium subscription required',
      code: 'PREMIUM_REQUIRED'
    });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await db.getAsync(
      'SELECT * FROM users WHERE id = ? AND status = "active"',
      [req.user.id]
    );

    if (!user || !user.is_admin) {
      return res.status(403).json({
        success: false,
        error: 'Admin access required',
        code: 'ADMIN_REQUIRED'
      });
    }

    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authorization error',
      code: 'AUTH_ERROR'
    });
  }
};