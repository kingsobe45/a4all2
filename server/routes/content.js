import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateCreateContent, validateId, validatePagination, validateSearch } from '../middleware/validation.js';

const router = express.Router();

// Get all content with filtering and pagination
router.get('/', optionalAuth, validatePagination, validateSearch, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { q, category, content_type, source, trending } = req.query;

    // Build WHERE clause
    const conditions = [];
    const params = [];

    if (q) {
      conditions.push('(title LIKE ? OR description LIKE ? OR tags LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (category) {
      conditions.push('tags LIKE ?');
      params.push(`%${category}%`);
    }

    if (content_type) {
      conditions.push('content_type = ?');
      params.push(content_type);
    }

    if (source) {
      conditions.push('source = ?');
      params.push(source);
    }

    if (trending === 'true') {
      conditions.push('is_trending = 1');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get content
    const content = await db.allAsync(
      `SELECT * FROM content ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const total = await db.getAsync(
      `SELECT COUNT(*) as count FROM content ${whereClause}`,
      params
    );

    // Parse JSON fields
    const processedContent = content.map(item => ({
      ...item,
      tags: JSON.parse(item.tags || '[]')
    }));

    res.json({
      success: true,
      data: {
        content: processedContent,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get content',
      code: 'GET_CONTENT_ERROR'
    });
  }
});

// Get single content item
router.get('/:id', optionalAuth, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const content = await db.getAsync(
      'SELECT * FROM content WHERE id = ?',
      [id]
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
        code: 'CONTENT_NOT_FOUND'
      });
    }

    // Increment view count
    await db.runAsync(
      'UPDATE content SET views = views + 1 WHERE id = ?',
      [id]
    );

    // Parse JSON fields
    const processedContent = {
      ...content,
      tags: JSON.parse(content.tags || '[]'),
      views: content.views + 1
    };

    res.json({
      success: true,
      data: { content: processedContent }
    });
  } catch (error) {
    console.error('Get content item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get content item',
      code: 'GET_CONTENT_ITEM_ERROR'
    });
  }
});

// Create new content
router.post('/', authenticateToken, validateCreateContent, async (req, res) => {
  try {
    const {
      title,
      description,
      content_type,
      source,
      author,
      thumbnail,
      url,
      tags,
      read_time,
      duration,
      ai_summary
    } = req.body;

    const contentId = uuidv4();

    await db.runAsync(
      `INSERT INTO content (
        id, title, description, content_type, source, author, thumbnail, url, 
        tags, read_time, duration, ai_summary
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        contentId,
        title,
        description,
        content_type,
        source,
        author,
        thumbnail,
        url,
        JSON.stringify(tags || []),
        read_time,
        duration,
        ai_summary
      ]
    );

    // Get created content
    const content = await db.getAsync(
      'SELECT * FROM content WHERE id = ?',
      [contentId]
    );

    // Parse JSON fields
    const processedContent = {
      ...content,
      tags: JSON.parse(content.tags || '[]')
    };

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      data: { content: processedContent }
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create content',
      code: 'CREATE_CONTENT_ERROR'
    });
  }
});

// Update content
router.put('/:id', authenticateToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      thumbnail,
      tags,
      read_time,
      duration,
      ai_summary,
      is_trending,
      is_featured
    } = req.body;

    // Check if content exists
    const existingContent = await db.getAsync(
      'SELECT id FROM content WHERE id = ?',
      [id]
    );

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
        code: 'CONTENT_NOT_FOUND'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (title) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (thumbnail) {
      updates.push('thumbnail = ?');
      values.push(thumbnail);
    }
    if (tags) {
      updates.push('tags = ?');
      values.push(JSON.stringify(tags));
    }
    if (read_time) {
      updates.push('read_time = ?');
      values.push(read_time);
    }
    if (duration) {
      updates.push('duration = ?');
      values.push(duration);
    }
    if (ai_summary) {
      updates.push('ai_summary = ?');
      values.push(ai_summary);
    }
    if (is_trending !== undefined) {
      updates.push('is_trending = ?');
      values.push(is_trending ? 1 : 0);
    }
    if (is_featured !== undefined) {
      updates.push('is_featured = ?');
      values.push(is_featured ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update',
        code: 'NO_UPDATES'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await db.runAsync(
      `UPDATE content SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated content
    const content = await db.getAsync(
      'SELECT * FROM content WHERE id = ?',
      [id]
    );

    // Parse JSON fields
    const processedContent = {
      ...content,
      tags: JSON.parse(content.tags || '[]')
    };

    res.json({
      success: true,
      message: 'Content updated successfully',
      data: { content: processedContent }
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update content',
      code: 'UPDATE_CONTENT_ERROR'
    });
  }
});

// Delete content
router.delete('/:id', authenticateToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.runAsync(
      'DELETE FROM content WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
        code: 'CONTENT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete content',
      code: 'DELETE_CONTENT_ERROR'
    });
  }
});

// Like content
router.post('/:id/like', authenticateToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if content exists
    const content = await db.getAsync(
      'SELECT id, likes FROM content WHERE id = ?',
      [id]
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
        code: 'CONTENT_NOT_FOUND'
      });
    }

    // Increment likes
    await db.runAsync(
      'UPDATE content SET likes = likes + 1 WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Content liked successfully',
      data: { likes: content.likes + 1 }
    });
  } catch (error) {
    console.error('Like content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like content',
      code: 'LIKE_CONTENT_ERROR'
    });
  }
});

// Get trending content
router.get('/trending/all', optionalAuth, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const content = await db.allAsync(
      'SELECT * FROM content WHERE is_trending = 1 ORDER BY engagement_score DESC, views DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const total = await db.getAsync(
      'SELECT COUNT(*) as count FROM content WHERE is_trending = 1'
    );

    // Parse JSON fields
    const processedContent = content.map(item => ({
      ...item,
      tags: JSON.parse(item.tags || '[]')
    }));

    res.json({
      success: true,
      data: {
        content: processedContent,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get trending content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get trending content',
      code: 'GET_TRENDING_ERROR'
    });
  }
});

export default router;