import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/init.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validation.js';

const router = express.Router();

// AI Chat endpoint
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, conversation_id } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
        code: 'MESSAGE_REQUIRED'
      });
    }

    // Simulate AI response generation
    const aiResponse = generateAIResponse(message);

    // If user is authenticated, record the interaction
    if (req.user) {
      await db.runAsync(
        'INSERT INTO user_activity (id, user_id, activity_type, description, xp_earned) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), req.user.id, 'ai_chat', `AI conversation: ${message.substring(0, 50)}...`, 2]
      );

      // Add small XP reward for AI interaction
      await db.runAsync(
        'UPDATE users SET xp = xp + 2 WHERE id = ?',
        [req.user.id]
      );
    }

    res.json({
      success: true,
      data: {
        response: aiResponse,
        conversation_id: conversation_id || uuidv4(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process AI chat',
      code: 'AI_CHAT_ERROR'
    });
  }
});

// Generate content summary
router.post('/summarize', optionalAuth, async (req, res) => {
  try {
    const { content, max_length = 200 } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Content is required',
        code: 'CONTENT_REQUIRED'
      });
    }

    // Simulate AI summarization
    const summary = generateSummary(content, max_length);

    res.json({
      success: true,
      data: {
        summary,
        original_length: content.length,
        summary_length: summary.length,
        compression_ratio: Math.round((1 - summary.length / content.length) * 100)
      }
    });
  } catch (error) {
    console.error('AI Summarize error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate summary',
      code: 'AI_SUMMARIZE_ERROR'
    });
  }
});

// Generate content recommendations
router.get('/recommendations', authenticateToken, validatePagination, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get user's activity to understand preferences
    const userActivity = await db.allAsync(
      'SELECT activity_type, description FROM user_activity WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );

    // Get user's game history for game recommendations
    const gameHistory = await db.allAsync(
      'SELECT DISTINCT g.category FROM game_scores gs JOIN games g ON gs.game_id = g.id WHERE gs.user_id = ?',
      [userId]
    );

    // Simple recommendation algorithm based on user activity
    const recommendations = await generateRecommendations(userId, userActivity, gameHistory, limit, offset);

    res.json({
      success: true,
      data: {
        recommendations,
        pagination: {
          page,
          limit,
          total: recommendations.length,
          pages: Math.ceil(recommendations.length / limit)
        }
      }
    });
  } catch (error) {
    console.error('AI Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations',
      code: 'AI_RECOMMENDATIONS_ERROR'
    });
  }
});

// Analyze trending topics
router.post('/analyze-trends', optionalAuth, async (req, res) => {
  try {
    const { topics, timeframe = 'week' } = req.body;

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Topics array is required',
        code: 'TOPICS_REQUIRED'
      });
    }

    // Simulate trend analysis
    const analysis = await analyzeTrends(topics, timeframe);

    res.json({
      success: true,
      data: {
        analysis,
        timeframe,
        analyzed_topics: topics.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI Trend Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze trends',
      code: 'AI_TREND_ANALYSIS_ERROR'
    });
  }
});

// Generate game challenges
router.post('/generate-challenge', authenticateToken, async (req, res) => {
  try {
    const { game_type, difficulty = 'intermediate', user_level } = req.body;
    const userId = req.user.id;

    // Get user's skill level in this game type
    const userStats = await db.getAsync(
      `SELECT AVG(score) as avg_score, COUNT(*) as games_played, MAX(score) as best_score
       FROM game_scores gs 
       JOIN games g ON gs.game_id = g.id 
       WHERE gs.user_id = ? AND g.category = ?`,
      [userId, game_type]
    );

    // Generate personalized challenge
    const challenge = generateGameChallenge(game_type, difficulty, userStats, user_level);

    res.json({
      success: true,
      data: {
        challenge,
        user_stats: userStats,
        estimated_xp: challenge.estimated_xp
      }
    });
  } catch (error) {
    console.error('AI Generate Challenge error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate challenge',
      code: 'AI_GENERATE_CHALLENGE_ERROR'
    });
  }
});

// Content moderation
router.post('/moderate', authenticateToken, async (req, res) => {
  try {
    const { content, content_type } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Content is required',
        code: 'CONTENT_REQUIRED'
      });
    }

    // Simulate content moderation
    const moderation = moderateContent(content, content_type);

    res.json({
      success: true,
      data: moderation
    });
  } catch (error) {
    console.error('AI Moderation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to moderate content',
      code: 'AI_MODERATION_ERROR'
    });
  }
});

// Helper functions for AI simulation

function generateAIResponse(message) {
  const responses = {
    greeting: [
      "Hello! I'm A4AI, your intelligent companion. I can help you discover content, explain complex topics, summarize articles, and even play games with you. What would you like to explore today?",
      "Hi there! Ready to dive into some amazing content? I can help you find trending topics, explain concepts, or even challenge you to a quiz!",
    ],
    discovery: [
      "I'd love to help you discover new content! Based on current trends, I'm seeing exciting developments in AI, space exploration, and sustainable technology. What field interests you most?",
      "For content discovery, I can analyze trending topics across platforms. Are you interested in videos, articles, or perhaps some interactive content?",
    ],
    games: [
      "Gaming time! I can suggest trending games, create custom trivia based on your interests, or even play word games with you. What sounds fun?",
      "Let's play! How about a quick AI vs Human challenge? I can create personalized quizzes or recommend games based on your skill level.",
    ],
    default: [
      "That's an interesting question! Let me help you explore that topic further. Based on my analysis of current trends and data...",
      "Great question! I'm processing information from multiple sources to give you the most comprehensive answer...",
    ],
  };

  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  } else if (lowerMessage.includes('discover') || lowerMessage.includes('find') || lowerMessage.includes('search')) {
    return responses.discovery[Math.floor(Math.random() * responses.discovery.length)];
  } else if (lowerMessage.includes('game') || lowerMessage.includes('play') || lowerMessage.includes('quiz')) {
    return responses.games[Math.floor(Math.random() * responses.games.length)];
  } else {
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  }
}

function generateSummary(content, maxLength) {
  // Simple summarization simulation
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const targetSentences = Math.max(1, Math.floor(sentences.length * 0.3));
  
  // Take first few sentences as a simple summary
  const summary = sentences.slice(0, targetSentences).join('. ') + '.';
  
  if (summary.length > maxLength) {
    return summary.substring(0, maxLength - 3) + '...';
  }
  
  return summary;
}

async function generateRecommendations(userId, userActivity, gameHistory, limit, offset) {
  // Simulate AI-powered recommendations
  const recommendations = [];
  
  // Content recommendations based on activity
  const contentRecs = await db.allAsync(
    'SELECT * FROM content WHERE is_trending = 1 OR is_featured = 1 ORDER BY engagement_score DESC LIMIT ?',
    [Math.floor(limit / 2)]
  );
  
  contentRecs.forEach(content => {
    recommendations.push({
      type: 'content',
      item: content,
      reason: 'Based on trending topics and your interests',
      confidence: Math.random() * 0.3 + 0.7 // 70-100%
    });
  });
  
  // Game recommendations based on history
  const gameCategories = gameHistory.map(g => g.category);
  if (gameCategories.length > 0) {
    const gameRecs = await db.allAsync(
      `SELECT * FROM games WHERE category IN (${gameCategories.map(() => '?').join(',')}) AND is_featured = 1 LIMIT ?`,
      [...gameCategories, Math.floor(limit / 2)]
    );
    
    gameRecs.forEach(game => {
      recommendations.push({
        type: 'game',
        item: game,
        reason: `Recommended based on your ${game.category} game activity`,
        confidence: Math.random() * 0.2 + 0.8 // 80-100%
      });
    });
  }
  
  return recommendations.slice(offset, offset + limit);
}

async function analyzeTrends(topics, timeframe) {
  // Simulate trend analysis
  const analysis = {
    summary: `Analysis of ${topics.length} topics over the ${timeframe}`,
    trends: [],
    insights: [],
    predictions: []
  };
  
  for (const topic of topics) {
    const trendData = {
      topic,
      momentum: Math.random() * 100,
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
      growth_rate: (Math.random() - 0.5) * 200, // -100% to +100%
      related_topics: topics.filter(t => t !== topic).slice(0, 3)
    };
    
    analysis.trends.push(trendData);
  }
  
  analysis.insights = [
    'AI and machine learning topics show strong upward momentum',
    'Gaming content maintains steady engagement across all demographics',
    'Sustainability topics are gaining traction among younger audiences'
  ];
  
  analysis.predictions = [
    'Expect continued growth in AI-related content over the next month',
    'Gaming trends suggest increased interest in strategy and puzzle games',
    'Cross-platform content sharing will likely increase'
  ];
  
  return analysis;
}

function generateGameChallenge(gameType, difficulty, userStats, userLevel) {
  const challenges = {
    strategy: {
      beginner: { description: 'Complete a 5-move chess puzzle', estimated_xp: 25 },
      intermediate: { description: 'Win a game in under 20 moves', estimated_xp: 50 },
      advanced: { description: 'Achieve checkmate using only minor pieces', estimated_xp: 100 },
      expert: { description: 'Win a blindfolded chess match', estimated_xp: 200 }
    },
    puzzle: {
      beginner: { description: 'Solve 10 logic puzzles in a row', estimated_xp: 30 },
      intermediate: { description: 'Complete a puzzle in under 2 minutes', estimated_xp: 60 },
      advanced: { description: 'Solve a 500-piece jigsaw puzzle', estimated_xp: 120 },
      expert: { description: 'Create and solve your own puzzle', estimated_xp: 250 }
    },
    trivia: {
      beginner: { description: 'Answer 15 questions correctly', estimated_xp: 20 },
      intermediate: { description: 'Achieve 90% accuracy in a category', estimated_xp: 40 },
      advanced: { description: 'Win 5 trivia matches in a row', estimated_xp: 80 },
      expert: { description: 'Create a perfect trivia round', estimated_xp: 150 }
    }
  };
  
  const challenge = challenges[gameType]?.[difficulty] || challenges.puzzle.intermediate;
  
  // Adjust based on user stats
  if (userStats?.avg_score > 80) {
    challenge.estimated_xp = Math.floor(challenge.estimated_xp * 1.2);
  }
  
  return {
    ...challenge,
    id: uuidv4(),
    game_type: gameType,
    difficulty,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    personalized: !!userStats?.games_played
  };
}

function moderateContent(content, contentType) {
  // Simple content moderation simulation
  const flaggedWords = ['spam', 'inappropriate', 'offensive', 'harmful'];
  const contentLower = content.toLowerCase();
  
  const flags = flaggedWords.filter(word => contentLower.includes(word));
  
  return {
    approved: flags.length === 0,
    confidence: Math.random() * 0.2 + 0.8, // 80-100%
    flags: flags,
    suggestions: flags.length > 0 ? ['Consider rephrasing flagged content', 'Review community guidelines'] : [],
    severity: flags.length > 2 ? 'high' : flags.length > 0 ? 'medium' : 'low'
  };
}

export default router;