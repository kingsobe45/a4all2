import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateUpdateProfile, validateId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Get user profile
router.get('/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.getAsync(
      `SELECT id, username, email, avatar, bio, xp, level, followers_count, following_count, 
       is_verified, is_premium, created_at FROM users WHERE id = ? AND status = "active"`,
      [id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    // Get user badges
    const badges = await db.allAsync(
      'SELECT badge_name, badge_description, earned_at FROM user_badges WHERE user_id = ?',
      [id]
    );

    // Get recent activity
    const activity = await db.allAsync(
      'SELECT activity_type, description, xp_earned, created_at FROM user_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [id]
    );

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          badges: badges,
          recentActivity: activity
        }
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
      code: 'GET_PROFILE_ERROR'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, validateUpdateProfile, async (req, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const userId = req.user.id;

    // Check if username is taken (if provided)
    if (username) {
      const existingUser = await db.getAsync(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, userId]
      );

      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Username already taken',
          code: 'USERNAME_TAKEN'
        });
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    if (bio !== undefined) {
      updates.push('bio = ?');
      values.push(bio);
    }
    if (avatar) {
      updates.push('avatar = ?');
      values.push(avatar);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
        code: 'NO_UPDATES'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    await db.runAsync(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated user data
    const updatedUser = await db.getAsync(
      'SELECT id, username, email, avatar, bio, xp, level, followers_count, following_count, is_verified, is_premium FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      code: 'UPDATE_PROFILE_ERROR'
    });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required',
        code: 'MISSING_PASSWORDS'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long',
        code: 'PASSWORD_TOO_SHORT'
      });
    }

    // Get current user
    const user = await db.getAsync(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.runAsync(
      'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPasswordHash, userId]
    );

    // Invalidate all sessions except current one
    const authHeader = req.headers['authorization'];
    const currentToken = authHeader && authHeader.split(' ')[1];
    
    await db.runAsync(
      'DELETE FROM user_sessions WHERE user_id = ? AND token_hash != ?',
      [userId, currentToken]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      code: 'CHANGE_PASSWORD_ERROR'
    });
  }
});

// Update user settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { settings } = req.body;
    const userId = req.user.id;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Settings object is required',
        code: 'INVALID_SETTINGS'
      });
    }

    await db.runAsync(
      'UPDATE users SET settings = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(settings), userId]
    );

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: { settings }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update settings',
      code: 'UPDATE_SETTINGS_ERROR'
    });
  }
});

// Get user activity
router.get('/:id/activity', validateId, validatePagination, async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const activity = await db.allAsync(
      'SELECT * FROM user_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [id, limit, offset]
    );

    const total = await db.getAsync(
      'SELECT COUNT(*) as count FROM user_activity WHERE user_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: {
        activity,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user activity',
      code: 'GET_ACTIVITY_ERROR'
    });
  }
});

// Add XP to user
router.post('/xp', authenticateToken, async (req, res) => {
  try {
    const { points, activity_type, description } = req.body;
    const userId = req.user.id;

    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid points amount is required',
        code: 'INVALID_POINTS'
      });
    }

    // Get current user data
    const user = await db.getAsync(
      'SELECT xp, level FROM users WHERE id = ?',
      [userId]
    );

    const newXP = user.xp + points;
    const newLevel = Math.floor(newXP / 200) + 1;

    // Update user XP and level
    await db.runAsync(
      'UPDATE users SET xp = ?, level = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newXP, newLevel, userId]
    );

    // Record activity
    if (activity_type && description) {
      await db.runAsync(
        'INSERT INTO user_activity (id, user_id, activity_type, description, xp_earned) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), userId, activity_type, description, points]
      );
    }

    // Check for level up and award badge if needed
    if (newLevel > user.level) {
      // Award level up badge
      await db.runAsync(
        'INSERT INTO user_badges (id, user_id, badge_name, badge_description) VALUES (?, ?, ?, ?)',
        [uuidv4(), userId, `Level ${newLevel}`, `Reached level ${newLevel}`]
      );
    }

    res.json({
      success: true,
      message: 'XP added successfully',
      data: {
        xp: newXP,
        level: newLevel,
        pointsAdded: points,
        leveledUp: newLevel > user.level
      }
    });
  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add XP',
      code: 'ADD_XP_ERROR'
    });
  }
});

// Get user leaderboard
router.get('/leaderboard', validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const leaderboard = await db.allAsync(
      `SELECT id, username, avatar, xp, level, is_verified, is_premium 
       FROM users 
       WHERE status = "active" 
       ORDER BY xp DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const total = await db.getAsync(
      'SELECT COUNT(*) as count FROM users WHERE status = "active"'
    );

    res.json({
      success: true,
      data: {
        leaderboard,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get leaderboard',
      code: 'GET_LEADERBOARD_ERROR'
    });
  }
});

export default router;