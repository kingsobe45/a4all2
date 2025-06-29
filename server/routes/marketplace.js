import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateCreateMarketplaceItem, validateId, validatePagination, validateSearch } from '../middleware/validation.js';

const router = express.Router();

// Get all marketplace items
router.get('/', optionalAuth, validatePagination, validateSearch, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { q, category, min_price, max_price, featured, premium, sort } = req.query;

    // Build WHERE clause
    const conditions = [];
    const params = [];

    if (q) {
      conditions.push('(title LIKE ? OR description LIKE ? OR tags LIKE ?)');
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (min_price) {
      conditions.push('price >= ?');
      params.push(parseFloat(min_price));
    }

    if (max_price) {
      conditions.push('price <= ?');
      params.push(parseFloat(max_price));
    }

    if (featured === 'true') {
      conditions.push('is_featured = 1');
    }

    if (premium === 'true') {
      conditions.push('is_premium = 1');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Build ORDER BY clause
    let orderBy = 'ORDER BY downloads_count DESC'; // Default sort
    switch (sort) {
      case 'newest':
        orderBy = 'ORDER BY created_at DESC';
        break;
      case 'price-low':
        orderBy = 'ORDER BY price ASC';
        break;
      case 'price-high':
        orderBy = 'ORDER BY price DESC';
        break;
      case 'rating':
        orderBy = 'ORDER BY rating DESC';
        break;
      case 'downloads':
        orderBy = 'ORDER BY downloads_count DESC';
        break;
    }

    // Get items
    const items = await db.allAsync(
      `SELECT * FROM marketplace_items ${whereClause} ${orderBy} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const total = await db.getAsync(
      `SELECT COUNT(*) as count FROM marketplace_items ${whereClause}`,
      params
    );

    // Parse JSON fields
    const processedItems = items.map(item => ({
      ...item,
      tags: JSON.parse(item.tags || '[]'),
      compatibility: JSON.parse(item.compatibility || '[]')
    }));

    res.json({
      success: true,
      data: {
        items: processedItems,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get marketplace items error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get marketplace items',
      code: 'GET_MARKETPLACE_ERROR'
    });
  }
});

// Get single marketplace item
router.get('/:id', optionalAuth, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const item = await db.getAsync(
      'SELECT * FROM marketplace_items WHERE id = ?',
      [id]
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Marketplace item not found',
        code: 'ITEM_NOT_FOUND'
      });
    }

    // Check if user has purchased this item
    let hasPurchased = false;
    if (req.user) {
      const purchase = await db.getAsync(
        'SELECT id FROM user_purchases WHERE user_id = ? AND item_id = ?',
        [req.user.id, id]
      );
      hasPurchased = !!purchase;
    }

    // Parse JSON fields
    const processedItem = {
      ...item,
      tags: JSON.parse(item.tags || '[]'),
      compatibility: JSON.parse(item.compatibility || '[]'),
      hasPurchased
    };

    res.json({
      success: true,
      data: { item: processedItem }
    });
  } catch (error) {
    console.error('Get marketplace item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get marketplace item',
      code: 'GET_MARKETPLACE_ITEM_ERROR'
    });
  }
});

// Create new marketplace item
router.post('/', authenticateToken, validateCreateMarketplaceItem, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      original_price,
      author,
      author_avatar,
      image,
      tags,
      is_featured,
      is_premium,
      discount_percentage,
      compatibility,
      version
    } = req.body;

    const itemId = uuidv4();

    await db.runAsync(
      `INSERT INTO marketplace_items (
        id, title, description, category, price, original_price, author, 
        author_avatar, image, tags, is_featured, is_premium, discount_percentage,
        compatibility, version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itemId,
        title,
        description,
        category,
        price,
        original_price,
        author,
        author_avatar,
        image,
        JSON.stringify(tags || []),
        is_featured ? 1 : 0,
        is_premium ? 1 : 0,
        discount_percentage || 0,
        JSON.stringify(compatibility || []),
        version || '1.0.0'
      ]
    );

    // Get created item
    const item = await db.getAsync(
      'SELECT * FROM marketplace_items WHERE id = ?',
      [itemId]
    );

    // Parse JSON fields
    const processedItem = {
      ...item,
      tags: JSON.parse(item.tags || '[]'),
      compatibility: JSON.parse(item.compatibility || '[]')
    };

    res.status(201).json({
      success: true,
      message: 'Marketplace item created successfully',
      data: { item: processedItem }
    });
  } catch (error) {
    console.error('Create marketplace item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create marketplace item',
      code: 'CREATE_MARKETPLACE_ITEM_ERROR'
    });
  }
});

// Purchase marketplace item
router.post('/:id/purchase', authenticateToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get item details
    const item = await db.getAsync(
      'SELECT * FROM marketplace_items WHERE id = ?',
      [id]
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Marketplace item not found',
        code: 'ITEM_NOT_FOUND'
      });
    }

    // Check if already purchased
    const existingPurchase = await db.getAsync(
      'SELECT id FROM user_purchases WHERE user_id = ? AND item_id = ?',
      [userId, id]
    );

    if (existingPurchase) {
      return res.status(409).json({
        success: false,
        error: 'Item already purchased',
        code: 'ALREADY_PURCHASED'
      });
    }

    // For free items, price is 0
    const pricePaid = item.price || 0;

    // Create purchase record
    const purchaseId = uuidv4();
    await db.runAsync(
      'INSERT INTO user_purchases (id, user_id, item_id, price_paid) VALUES (?, ?, ?, ?)',
      [purchaseId, userId, id, pricePaid]
    );

    // Update download count
    await db.runAsync(
      'UPDATE marketplace_items SET downloads_count = downloads_count + 1 WHERE id = ?',
      [id]
    );

    // Record activity
    await db.runAsync(
      'INSERT INTO user_activity (id, user_id, activity_type, description, xp_earned) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), userId, 'purchase', `Purchased ${item.title}`, 5]
    );

    // Add XP for purchase
    await db.runAsync(
      'UPDATE users SET xp = xp + 5 WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: 'Item purchased successfully',
      data: {
        purchaseId,
        pricePaid,
        xpEarned: 5
      }
    });
  } catch (error) {
    console.error('Purchase item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to purchase item',
      code: 'PURCHASE_ERROR'
    });
  }
});

// Get user's purchases
router.get('/user/purchases', authenticateToken, validatePagination, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Get user's purchases
    const purchases = await db.allAsync(
      `SELECT up.*, mi.title, mi.description, mi.category, mi.image, mi.author, mi.version
       FROM user_purchases up 
       JOIN marketplace_items mi ON up.item_id = mi.id 
       WHERE up.user_id = ? 
       ORDER BY up.purchased_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    // Get total count
    const total = await db.getAsync(
      'SELECT COUNT(*) as count FROM user_purchases WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      data: {
        purchases,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user purchases error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user purchases',
      code: 'GET_PURCHASES_ERROR'
    });
  }
});

// Get featured marketplace items
router.get('/featured/all', optionalAuth, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const items = await db.allAsync(
      'SELECT * FROM marketplace_items WHERE is_featured = 1 ORDER BY rating DESC, downloads_count DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const total = await db.getAsync(
      'SELECT COUNT(*) as count FROM marketplace_items WHERE is_featured = 1'
    );

    // Parse JSON fields
    const processedItems = items.map(item => ({
      ...item,
      tags: JSON.parse(item.tags || '[]'),
      compatibility: JSON.parse(item.compatibility || '[]')
    }));

    res.json({
      success: true,
      data: {
        items: processedItems,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get featured marketplace items error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get featured marketplace items',
      code: 'GET_FEATURED_MARKETPLACE_ERROR'
    });
  }
});

// Get marketplace categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await db.allAsync(
      'SELECT category, COUNT(*) as count FROM marketplace_items GROUP BY category ORDER BY count DESC'
    );

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get marketplace categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get marketplace categories',
      code: 'GET_CATEGORIES_ERROR'
    });
  }
});

export default router;