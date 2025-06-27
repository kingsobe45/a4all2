import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Play, MessageSquare, Zap, Star, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const trendingHashtags = [
  '#AI', '#MachineLearning', '#WebDev', '#React', '#Python', '#Blockchain',
  '#Gaming', '#TechNews', '#Innovation', '#Future', '#Design', '#Productivity'
];

const featuredContent = [
  {
    id: 1,
    type: 'video',
    title: 'The Future of AI in 2024: Revolutionary Breakthroughs',
    source: 'TechVision',
    thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '12:45',
    views: '2.3M',
    engagement: 95,
    tags: ['AI', 'Future', 'Technology']
  },
  {
    id: 2,
    type: 'article',
    title: 'Building Scalable Web Applications with Modern Frameworks',
    source: 'Dev Weekly',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    readTime: '8 min',
    views: '156K',
    engagement: 88,
    tags: ['WebDev', 'React', 'JavaScript']
  },
  {
    id: 3,
    type: 'game',
    title: 'Quantum Chess: The Mind-Bending Strategy Game',
    source: 'GameHub',
    thumbnail: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
    players: '24K',
    views: '890K',
    engagement: 92,
    tags: ['Gaming', 'Strategy', 'Multiplayer']
  },
  {
    id: 4,
    type: 'discussion',
    title: 'The Ethics of AI: Where Do We Draw the Line?',
    source: 'ThinkTank',
    thumbnail: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=400',
    comments: '1.2K',
    views: '445K',
    engagement: 87,
    tags: ['AI', 'Ethics', 'Discussion']
  }
];

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discovery?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                One Website
              </span>
              <br />
              <span className="text-slate-800 dark:text-slate-200">
                To Rule Them All
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
              Discover, learn, play, and connect with AI-powered intelligence. 
              Your gateway to trending content, games, and conversations.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anything... videos, articles, games, discussions"
                className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 shadow-xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <Zap className="w-4 h-4" />
              </button>
            </div>
          </motion.form>

          {/* Trending Hashtags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Trending Now
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {trendingHashtags.map((tag, index) => (
                <motion.button
                  key={tag}
                  onClick={() => navigate(`/discovery?q=${encodeURIComponent(tag)}`)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-700 dark:text-primary-300 rounded-full hover:shadow-lg transition-all duration-300 border border-primary-200 dark:border-primary-700"
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Featured Content
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              AI-curated content tailored to your interests and trending topics
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredContent.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.type === 'video' ? 'bg-red-500 text-white' :
                      item.type === 'article' ? 'bg-blue-500 text-white' :
                      item.type === 'game' ? 'bg-purple-500 text-white' :
                      'bg-green-500 text-white'
                    }`}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs flex items-center">
                    {item.type === 'video' && (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        {item.duration}
                      </>
                    )}
                    {item.type === 'article' && (
                      <>
                        <Clock className="w-3 h-3 mr-1" />
                        {item.readTime}
                      </>
                    )}
                    {item.type === 'game' && (
                      <>
                        <Star className="w-3 h-3 mr-1" />
                        {item.players} players
                      </>
                    )}
                    {item.type === 'discussion' && (
                      <>
                        <MessageSquare className="w-3 h-3 mr-1" />
                        {item.comments} comments
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    by {item.source}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <Eye className="w-4 h-4 mr-1" />
                      {item.views}
                    </div>
                    <div className="flex items-center">
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                          style={{ width: `${item.engagement}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                        {item.engagement}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.button
              onClick={() => navigate('/discovery')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Search className="w-8 h-8 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-primary-100">Find trending content across all platforms</p>
            </motion.button>

            <motion.button
              onClick={() => navigate('/games')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 bg-gradient-to-br from-secondary-500 to-cyan-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Play className="w-8 h-8 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Play</h3>
              <p className="text-secondary-100">Challenge your mind with AI-powered games</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 bg-gradient-to-br from-accent-500 to-orange-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <MessageSquare className="w-8 h-8 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-accent-100">Join discussions and share insights</p>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}