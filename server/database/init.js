import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'a4all.db');
const db = new sqlite3.Database(dbPath);

// Promisify database methods
db.runAsync = promisify(db.run.bind(db));
db.getAsync = promisify(db.get.bind(db));
db.allAsync = promisify(db.all.bind(db));

export const initializeDatabase = async () => {
  try {
    console.log('🗄️  Initializing database...');

    // Enable foreign keys
    await db.runAsync('PRAGMA foreign_keys = ON');

    // Users table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar TEXT,
        bio TEXT,
        xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        followers_count INTEGER DEFAULT 0,
        following_count INTEGER DEFAULT 0,
        is_verified BOOLEAN DEFAULT FALSE,
        is_premium BOOLEAN DEFAULT FALSE,
        settings TEXT DEFAULT '{}',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted'))
      )
    `);

    // User badges table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS user_badges (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        badge_name TEXT NOT NULL,
        badge_description TEXT,
        earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Content table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS content (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        content_type TEXT NOT NULL CHECK (content_type IN ('video', 'article', 'discussion', 'image', 'code')),
        source TEXT NOT NULL,
        author TEXT NOT NULL,
        thumbnail TEXT,
        url TEXT,
        tags TEXT DEFAULT '[]',
        views INTEGER DEFAULT 0,
        likes INTEGER DEFAULT 0,
        comments_count INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0,
        engagement_score REAL DEFAULT 0,
        ai_summary TEXT,
        read_time INTEGER,
        duration TEXT,
        is_trending BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Games table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS games (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        thumbnail TEXT,
        difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
        play_time TEXT,
        players_count INTEGER DEFAULT 0,
        rating REAL DEFAULT 0,
        reviews_count INTEGER DEFAULT 0,
        is_ai_powered BOOLEAN DEFAULT FALSE,
        is_featured BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Game scores table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS game_scores (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        game_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        xp_earned INTEGER DEFAULT 0,
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE
      )
    `);

    // Marketplace items table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS marketplace_items (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        price REAL DEFAULT 0,
        original_price REAL,
        author TEXT NOT NULL,
        author_avatar TEXT,
        image TEXT,
        tags TEXT DEFAULT '[]',
        rating REAL DEFAULT 0,
        reviews_count INTEGER DEFAULT 0,
        downloads_count INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_premium BOOLEAN DEFAULT FALSE,
        discount_percentage INTEGER DEFAULT 0,
        compatibility TEXT DEFAULT '[]',
        version TEXT DEFAULT '1.0.0',
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User purchases table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS user_purchases (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        item_id TEXT NOT NULL,
        price_paid REAL NOT NULL,
        purchased_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES marketplace_items (id) ON DELETE CASCADE
      )
    `);

    // Notifications table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'game', 'social', 'achievement')),
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        action_url TEXT,
        avatar TEXT,
        icon TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // User activity table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        activity_type TEXT NOT NULL,
        description TEXT NOT NULL,
        xp_earned INTEGER DEFAULT 0,
        metadata TEXT DEFAULT '{}',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // User sessions table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token_hash TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Trending topics table
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS trending_topics (
        id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        category TEXT NOT NULL,
        mentions_count INTEGER DEFAULT 0,
        engagement_score REAL DEFAULT 0,
        hashtags TEXT DEFAULT '[]',
        related_content TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_users_username ON users (username)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_content_type ON content (content_type)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_content_trending ON content (is_trending)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_games_category ON games (category)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_marketplace_category ON marketplace_items (category)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications (user_id, is_read)');
    await db.runAsync('CREATE INDEX IF NOT EXISTS idx_user_activity_user ON user_activity (user_id)');

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export { db };