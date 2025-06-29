import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateCreateNotification, validateId, validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, validatePagination, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { unread_only } = req.query;

    // Build WHERE clause
    let whereClause = 'WHERE user_id = ?';
    const params = [userId];

    if (unread_only === 'true') {
      whereClause += ' AND is_read = 0';
    }

    // Get notifications
    const notifications = await db.allAsync(
      `SELECT * FROM notifications ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const total = await db.getAsync(
      `SELECT COUNT(*) as count FROM notifications ${whereClause}`,
      params
    );

    // Get unread count
    const unreadCount = await db.getAsync(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount: unreadCount.count,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notifications',
      code: 'GET_NOTIFICATIONS_ERROR'
    });
  }
});

// Create notification
router.post('/', authenticateToken, validateCreateNotification, async (req, res) => {
  try {
    const {
      user_id,
      type,
      title,
      message,
      action_url,
      avatar,
      icon
    } = req.body;

    const notificationId = uuidv4();

    await db.runAsync(
      `INSERT INTO notifications (
        id, user_id, type, title, message, action_url, avatar, icon
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        notificationId,
        user_id,
        type,
        title,
        message,
        action_url,
        avatar,
        icon
      ]
    );

    // Get created notification
    const notification = await db.getAsync(
      'SELECT * FROM notifications WHERE id = ?',
      [notificationId]
    );

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: { notification }
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification',
      code: 'CREATE_NOTIFICATION_ERROR'
    });
  }
});

// Mark notification as read
router.put('/:id/read', authenticateToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await db.runAsync(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
        code: 'NOTIFICATION_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      code: 'MARK_READ_ERROR'
    });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await db.runAsync(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [userId]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark all notifications as read',
      code: 'MARK_ALL_READ_ERROR'
    });
  }
});

// Delete notification
router.delete('/:id', authenticateToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await db.runAsync(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
        code: 'NOTIFICATION_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
      code: 'DELETE_NOTIFICATION_ERROR'
    });
  }
});

// Clear all notifications
router.delete('/clear-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await db.runAsync(
      'DELETE FROM notifications WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'All notifications cleared'
    });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear all notifications',
      code: 'CLEAR_ALL_ERROR'
    });
  }
});

// Get notification statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get notification counts by type
    const typeStats = await db.allAsync(
      'SELECT type, COUNT(*) as count FROM notifications WHERE user_id = ? GROUP BY type',
      [userId]
    );

    // Get read/unread counts
    const readStats = await db.allAsync(
      'SELECT is_read, COUNT(*) as count FROM notifications WHERE user_id = ? GROUP BY is_read',
      [userId]
    );

    // Get recent activity (last 7 days)
    const recentActivity = await db.getAsync(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND created_at >= datetime("now", "-7 days")',
      [userId]
    );

    res.json({
      success: true,
      data: {
        typeStats,
        readStats,
        recentActivity: recentActivity.count
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notification statistics',
      code: 'GET_STATS_ERROR'
    });
  }
});

export default router;