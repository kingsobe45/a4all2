import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = express.Router();

// Get trending topics
router.get('/trending', optionalAuth, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { category, timeframe } = req.query;

    // Build WHERE clause
    const conditions = [];
    const params = [];

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    // Add timeframe filter
    if (timeframe) {
      switch (timeframe) {
        case 'today':
          conditions.push('updated_at >= datetime("now", "-1 day")');
          break;
        case 'week':
          conditions.push('updated_at >= datetime("now", "-7 days")');
          break;
        case 'month':
          conditions.push('updated_at >= datetime("now", "-30 days")');
          break;
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get trending topics
    const topics = await db.allAsync(
      `SELECT * FROM trending_topics ${whereClause} ORDER BY engagement_score DESC, mentions_count DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const total = await db.getAsync(
      `SELECT COUNT(*) as count FROM trending_topics ${whereClause}`,
      params
    );

    // Parse JSON fields
    const processedTopics = topics.map(topic => ({
      ...topic,
      hashtags: JSON.parse(topic.hashtags || '[]'),
      related_content: JSON.parse(topic.related_content || '[]')
    }));

    res.json({
      success: true,
      data: {
        topics: processedTopics,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get trending topics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get trending topics',
      code: 'GET_TRENDING_ERROR'
    });
  }
});

// Get platform statistics
router.get('/stats', optionalAuth, async (req, res) => {
  try {
    // Get user statistics
    const userStats = await db.getAsync(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
        COUNT(CASE WHEN is_premium = 1 THEN 1 END) as premium_users,
        COUNT(CASE WHEN created_at >= datetime('now', '-30 days') THEN 1 END) as new_users_month
      FROM users
    `);

    // Get content statistics
    const contentStats = await db.getAsync(`
      SELECT 
        COUNT(*) as total_content,
        COUNT(CASE WHEN is_trending = 1 THEN 1 END) as trending_content,
        COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_content,
        SUM(views) as total_views,
        SUM(likes) as total_likes
      FROM content
    `);

    // Get game statistics
    const gameStats = await db.getAsync(`
      SELECT 
        COUNT(*) as total_games,
        COUNT(CASE WHEN is_featured = 1 THEN 1 END) as featured_games,
        SUM(players_count) as total_players,
        AVG(rating) as average_rating
      FROM games
    `);

    // Get marketplace statistics
    const marketplaceStats = await db.getAsync(`
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN is_premium = 1 THEN 1 END) as premium_items,
        SUM(downloads_count) as total_downloads,
        AVG(rating) as average_rating,
        SUM(CASE WHEN price = 0 THEN 1 ELSE 0 END) as free_items
      FROM marketplace_items
    `);

    // Get activity statistics
    const activityStats = await db.getAsync(`
      SELECT 
        COUNT(*) as total_activities,
        COUNT(CASE WHEN created_at >= datetime('now', '-24 hours') THEN 1 END) as activities_today,
        COUNT(CASE WHEN created_at >= datetime('now', '-7 days') THEN 1 END) as activities_week,
        SUM(xp_earned) as total_xp_earned
      FROM user_activity
    `);

    // Get top content types
    const contentTypes = await db.allAsync(`
      SELECT content_type, COUNT(*) as count 
      FROM content 
      GROUP BY content_type 
      ORDER BY count DESC
    `);

    // Get top game categories
    const gameCategories = await db.allAsync(`
      SELECT category, COUNT(*) as count 
      FROM games 
      GROUP BY category 
      ORDER BY count DESC
    `);

    res.json({
      success: true,
      data: {
        users: userStats,
        content: contentStats,
        games: gameStats,
        marketplace: marketplaceStats,
        activity: activityStats,
        contentTypes,
        gameCategories
      }
    });
  } catch (error) {
    console.error('Get platform stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get platform statistics',
      code: 'GET_STATS_ERROR'
    });
  }
});

// Get user engagement analytics
router.get('/engagement', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe = 'week' } = req.query;

    let dateFilter = '';
    switch (timeframe) {
      case 'today':
        dateFilter = 'datetime("now", "-1 day")';
        break;
      case 'week':
        dateFilter = 'datetime("now", "-7 days")';
        break;
      case 'month':
        dateFilter = 'datetime("now", "-30 days")';
        break;
      default:
        dateFilter = 'datetime("now", "-7 days")';
    }

    // Get user activity breakdown
    const activityBreakdown = await db.allAsync(
      `SELECT activity_type, COUNT(*) as count, SUM(xp_earned) as total_xp
       FROM user_activity 
       WHERE user_id = ? AND created_at >= ${dateFilter}
       GROUP BY activity_type 
       ORDER BY count DESC`,
      [userId]
    );

    // Get daily activity for the timeframe
    const dailyActivity = await db.allAsync(
      `SELECT 
         DATE(created_at) as date,
         COUNT(*) as activities,
         SUM(xp_earned) as xp_earned
       FROM user_activity 
       WHERE user_id = ? AND created_at >= ${dateFilter}
       GROUP BY DATE(created_at) 
       ORDER BY date`,
      [userId]
    );

    // Get game performance
    const gamePerformance = await db.allAsync(
      `SELECT 
         g.title,
         COUNT(gs.id) as games_played,
         MAX(gs.score) as best_score,
         AVG(gs.score) as average_score,
         SUM(gs.xp_earned) as total_xp
       FROM game_scores gs
       JOIN games g ON gs.game_id = g.id
       WHERE gs.user_id = ? AND gs.completed_at >= ${dateFilter}
       GROUP BY g.id, g.title
       ORDER BY games_played DESC
       LIMIT 10`,
      [userId]
    );

    // Get content interaction
    const contentInteraction = await db.getAsync(
      `SELECT 
         COUNT(CASE WHEN activity_type = 'discovery' THEN 1 END) as content_discovered,
         COUNT(CASE WHEN activity_type = 'social' THEN 1 END) as social_interactions
       FROM user_activity 
       WHERE user_id = ? AND created_at >= ${dateFilter}`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        timeframe,
        activityBreakdown,
        dailyActivity,
        gamePerformance,
        contentInteraction
      }
    });
  } catch (error) {
    console.error('Get engagement analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get engagement analytics',
      code: 'GET_ENGAGEMENT_ERROR'
    });
  }
});

// Create or update trending topic
router.post('/trending', authenticateToken, async (req, res) => {
  try {
    const {
      topic,
      category,
      mentions_count,
      engagement_score,
      hashtags,
      related_content
    } = req.body;

    if (!topic || !category) {
      return res.status(400).json({
        success: false,
        error: 'Topic and category are required',
        code: 'MISSING_REQUIRED_FIELDS'
      });
    }

    // Check if topic already exists
    const existingTopic = await db.getAsync(
      'SELECT id FROM trending_topics WHERE topic = ? AND category = ?',
      [topic, category]
    );

    if (existingTopic) {
      // Update existing topic
      await db.runAsync(
        `UPDATE trending_topics SET 
         mentions_count = ?, engagement_score = ?, hashtags = ?, 
         related_content = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [
          mentions_count || 0,
          engagement_score || 0,
          JSON.stringify(hashtags || []),
          JSON.stringify(related_content || []),
          existingTopic.id
        ]
      );

      const updatedTopic = await db.getAsync(
        'SELECT * FROM trending_topics WHERE id = ?',
        [existingTopic.id]
      );

      res.json({
        success: true,
        message: 'Trending topic updated successfully',
        data: {
          topic: {
            ...updatedTopic,
            hashtags: JSON.parse(updatedTopic.hashtags || '[]'),
            related_content: JSON.parse(updatedTopic.related_content || '[]')
          }
        }
      });
    } else {
      // Create new topic
      const topicId = uuidv4();
      await db.runAsync(
        `INSERT INTO trending_topics (
          id, topic, category, mentions_count, engagement_score, hashtags, related_content
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          topicId,
          topic,
          category,
          mentions_count || 0,
          engagement_score || 0,
          JSON.stringify(hashtags || []),
          JSON.stringify(related_content || [])
        ]
      );

      const newTopic = await db.getAsync(
        'SELECT * FROM trending_topics WHERE id = ?',
        [topicId]
      );

      res.status(201).json({
        success: true,
        message: 'Trending topic created successfully',
        data: {
          topic: {
            ...newTopic,
            hashtags: JSON.parse(newTopic.hashtags || '[]'),
            related_content: JSON.parse(newTopic.related_content || '[]')
          }
        }
      });
    }
  } catch (error) {
    console.error('Create/update trending topic error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create/update trending topic',
      code: 'TRENDING_TOPIC_ERROR'
    });
  }
});

// Get content performance analytics
router.get('/content-performance', optionalAuth, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { timeframe = 'week', content_type } = req.query;

    let dateFilter = '';
    switch (timeframe) {
      case 'today':
        dateFilter = 'AND created_at >= datetime("now", "-1 day")';
        break;
      case 'week':
        dateFilter = 'AND created_at >= datetime("now", "-7 days")';
        break;
      case 'month':
        dateFilter = 'AND created_at >= datetime("now", "-30 days")';
        break;
    }

    let typeFilter = '';
    if (content_type) {
      typeFilter = `AND content_type = '${content_type}'`;
    }

    // Get top performing content
    const topContent = await db.allAsync(
      `SELECT 
         id, title, content_type, source, author, views, likes, comments_count, shares,
         engagement_score, created_at,
         (views + likes * 2 + comments_count * 3 + shares * 4) as performance_score
       FROM content 
       WHERE 1=1 ${dateFilter} ${typeFilter}
       ORDER BY performance_score DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    // Get total count
    const total = await db.getAsync(
      `SELECT COUNT(*) as count FROM content WHERE 1=1 ${dateFilter} ${typeFilter}`
    );

    // Get performance summary
    const summary = await db.getAsync(
      `SELECT 
         COUNT(*) as total_content,
         SUM(views) as total_views,
         SUM(likes) as total_likes,
         SUM(comments_count) as total_comments,
         SUM(shares) as total_shares,
         AVG(engagement_score) as avg_engagement
       FROM content 
       WHERE 1=1 ${dateFilter} ${typeFilter}`
    );

    res.json({
      success: true,
      data: {
        topContent,
        summary,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get content performance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get content performance analytics',
      code: 'GET_CONTENT_PERFORMANCE_ERROR'
    });
  }
});

export default router;