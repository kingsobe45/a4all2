import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateCreateGame, validateId, validatePagination, validateSearch } from '../middleware/validation.js';

const router = express.Router();

// Get all games
router.get('/', optionalAuth, validatePagination, validateSearch, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { q, category, difficulty, featured } = req.query;

    // Build WHERE clause
    const conditions = [];
    const params = [];

    if (q) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      params.push(`%${q}%`, `%${q}%`);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (difficulty) {
      conditions.push('difficulty = ?');
      params.push(difficulty);
    }

    if (featured === 'true') {
      conditions.push('is_featured = 1');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get games
    const games = await db.allAsync(
      `SELECT * FROM games ${whereClause} ORDER BY players_count DESC, rating DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const total = await db.getAsync(
      `SELECT COUNT(*) as count FROM games ${whereClause}`,
      params
    );

    res.json({
      success: true,
      data: {
        games,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get games',
      code: 'GET_GAMES_ERROR'
    });
  }
});

// Get single game
router.get('/:id', optionalAuth, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const game = await db.getAsync(
      'SELECT * FROM games WHERE id = ?',
      [id]
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found',
        code: 'GAME_NOT_FOUND'
      });
    }

    // Get user's best score if authenticated
    let userBestScore = null;
    if (req.user) {
      const bestScore = await db.getAsync(
        'SELECT MAX(score) as best_score FROM game_scores WHERE user_id = ? AND game_id = ?',
        [req.user.id, id]
      );
      userBestScore = bestScore?.best_score || null;
    }

    // Get leaderboard (top 10)
    const leaderboard = await db.allAsync(
      `SELECT gs.score, u.username, u.avatar 
       FROM game_scores gs 
       JOIN users u ON gs.user_id = u.id 
       WHERE gs.game_id = ? 
       ORDER BY gs.score DESC 
       LIMIT 10`,
      [id]
    );

    res.json({
      success: true,
      data: {
        game,
        userBestScore,
        leaderboard
      }
    });
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get game',
      code: 'GET_GAME_ERROR'
    });
  }
});

// Create new game
router.post('/', authenticateToken, validateCreateGame, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      thumbnail,
      difficulty,
      play_time,
      is_ai_powered,
      is_featured
    } = req.body;

    const gameId = uuidv4();

    await db.runAsync(
      `INSERT INTO games (
        id, title, description, category, thumbnail, difficulty, 
        play_time, is_ai_powered, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        gameId,
        title,
        description,
        category,
        thumbnail,
        difficulty,
        play_time,
        is_ai_powered ? 1 : 0,
        is_featured ? 1 : 0
      ]
    );

    // Get created game
    const game = await db.getAsync(
      'SELECT * FROM games WHERE id = ?',
      [gameId]
    );

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: { game }
    });
  } catch (error) {
    console.error('Create game error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create game',
      code: 'CREATE_GAME_ERROR'
    });
  }
});

// Submit game score
router.post('/:id/score', authenticateToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.body;
    const userId = req.user.id;

    if (!score || score < 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid score is required',
        code: 'INVALID_SCORE'
      });
    }

    // Check if game exists
    const game = await db.getAsync(
      'SELECT id FROM games WHERE id = ?',
      [id]
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found',
        code: 'GAME_NOT_FOUND'
      });
    }

    // Calculate XP earned (base 10 + bonus for high scores)
    const xpEarned = Math.min(10 + Math.floor(score / 100), 100);

    // Save score
    const scoreId = uuidv4();
    await db.runAsync(
      'INSERT INTO game_scores (id, user_id, game_id, score, xp_earned) VALUES (?, ?, ?, ?, ?)',
      [scoreId, userId, id, score, xpEarned]
    );

    // Update user XP
    await db.runAsync(
      'UPDATE users SET xp = xp + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [xpEarned, userId]
    );

    // Update game players count
    await db.runAsync(
      'UPDATE games SET players_count = players_count + 1 WHERE id = ?',
      [id]
    );

    // Record activity
    await db.runAsync(
      'INSERT INTO user_activity (id, user_id, activity_type, description, xp_earned) VALUES (?, ?, ?, ?, ?)',
      [uuidv4(), userId, 'game', `Played ${game.title} and scored ${score}`, xpEarned]
    );

    // Get user's rank for this game
    const rank = await db.getAsync(
      'SELECT COUNT(*) + 1 as rank FROM game_scores WHERE game_id = ? AND score > ?',
      [id, score]
    );

    res.json({
      success: true,
      message: 'Score submitted successfully',
      data: {
        score,
        xpEarned,
        rank: rank.rank
      }
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit score',
      code: 'SUBMIT_SCORE_ERROR'
    });
  }
});

// Get game leaderboard
router.get('/:id/leaderboard', validateId, validatePagination, async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Check if game exists
    const game = await db.getAsync(
      'SELECT id, title FROM games WHERE id = ?',
      [id]
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found',
        code: 'GAME_NOT_FOUND'
      });
    }

    // Get leaderboard
    const leaderboard = await db.allAsync(
      `SELECT gs.score, gs.completed_at, u.username, u.avatar, u.level
       FROM game_scores gs 
       JOIN users u ON gs.user_id = u.id 
       WHERE gs.game_id = ? 
       ORDER BY gs.score DESC 
       LIMIT ? OFFSET ?`,
      [id, limit, offset]
    );

    // Get total count
    const total = await db.getAsync(
      'SELECT COUNT(*) as count FROM game_scores WHERE game_id = ?',
      [id]
    );

    res.json({
      success: true,
      data: {
        game: { id: game.id, title: game.title },
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

// Get user's game history
router.get('/user/:userId/history', validateId, validatePagination, async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Get user's game history
    const history = await db.allAsync(
      `SELECT gs.*, g.title, g.thumbnail, g.category
       FROM game_scores gs 
       JOIN games g ON gs.game_id = g.id 
       WHERE gs.user_id = ? 
       ORDER BY gs.completed_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    // Get total count
    const total = await db.getAsync(
      'SELECT COUNT(*) as count FROM game_scores WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      data: {
        history,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get game history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get game history',
      code: 'GET_GAME_HISTORY_ERROR'
    });
  }
});

// Get featured games
router.get('/featured/all', optionalAuth, validatePagination, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const games = await db.allAsync(
      'SELECT * FROM games WHERE is_featured = 1 ORDER BY rating DESC, players_count DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const total = await db.getAsync(
      'SELECT COUNT(*) as count FROM games WHERE is_featured = 1'
    );

    res.json({
      success: true,
      data: {
        games,
        pagination: {
          page,
          limit,
          total: total.count,
          pages: Math.ceil(total.count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get featured games error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get featured games',
      code: 'GET_FEATURED_GAMES_ERROR'
    });
  }
});

export default router;