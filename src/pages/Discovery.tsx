import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Clock, Eye, Heart, MessageSquare, Share, Bookmark } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const contentSources = ['All', 'YouTube', 'Reddit', 'Medium', 'Twitter', 'News', 'GitHub'];
const contentTypes = ['All', 'Videos', 'Articles', 'Discussions', 'Images', 'Code'];
const timeRanges = ['Today', 'This Week', 'This Month', 'All Time'];

const mockContent = [
  {
    id: 1,
    title: 'Advanced React Patterns for Large-Scale Applications',
    type: 'article',
    source: 'Medium',
    author: 'Sarah Chen',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    excerpt: 'Explore advanced React patterns including compound components, render props, and custom hooks for building maintainable applications...',
    engagement: { views: '45K', likes: '2.3K', comments: '189', shares: '567' },
    timestamp: '2 hours ago',
    readTime: '12 min',
    tags: ['React', 'JavaScript', 'WebDev', 'Frontend'],
    aiSummary: 'This article covers advanced React patterns essential for scaling applications, focusing on component composition and state management strategies.'
  },
  {
    id: 2,
    title: 'The Future of AI: Breakthrough Technologies in 2024',
    type: 'video',
    source: 'YouTube',
    author: 'TechVision',
    thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
    excerpt: 'Join us as we explore the most significant AI breakthroughs of 2024, from language models to robotics...',
    engagement: { views: '234K', likes: '12K', comments: '891', shares: '2.1K' },
    timestamp: '5 hours ago',
    duration: '18:42',
    tags: ['AI', 'Technology', 'Future', 'MachineLearning'],
    aiSummary: 'Comprehensive overview of 2024 AI innovations including multimodal models, robotic automation, and ethical AI development.'
  },
  {
    id: 3,
    title: 'Building Sustainable Web Applications',
    type: 'discussion',
    source: 'Reddit',
    author: 'r/webdev',
    thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    excerpt: 'Community discussion on best practices for building environmentally conscious web applications...',
    engagement: { views: '18K', likes: '892', comments: '234', shares: '156' },
    timestamp: '8 hours ago',
    tags: ['Sustainability', 'WebDev', 'Performance', 'Environment'],
    aiSummary: 'Discussion thread covering green coding practices, optimization techniques, and carbon footprint reduction in web development.'
  },
  {
    id: 4,
    title: 'Quantum Computing Explained Simply',
    type: 'article',
    source: 'News',
    author: 'Science Daily',
    thumbnail: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=400',
    excerpt: 'A beginner-friendly explanation of quantum computing principles and their real-world applications...',
    engagement: { views: '67K', likes: '3.4K', comments: '445', shares: '1.2K' },
    timestamp: '1 day ago',
    readTime: '8 min',
    tags: ['Quantum', 'Computing', 'Science', 'Physics'],
    aiSummary: 'Accessible introduction to quantum computing concepts, explaining qubits, superposition, and practical applications in cryptography and optimization.'
  }
];

export default function Discovery() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSource, setSelectedSource] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedTime, setSelectedTime] = useState('This Week');
  const [showFilters, setShowFilters] = useState(false);
  const [content, setContent] = useState(mockContent);

  useEffect(() => {
    // Simulate content filtering based on search and filters
    let filtered = mockContent;
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedSource !== 'All') {
      filtered = filtered.filter(item => item.source === selectedSource);
    }

    if (selectedType !== 'All') {
      const typeMap = { 'Videos': 'video', 'Articles': 'article', 'Discussions': 'discussion' };
      filtered = filtered.filter(item => item.type === typeMap[selectedType as keyof typeof typeMap]);
    }

    setContent(filtered);
  }, [searchQuery, selectedSource, selectedType, selectedTime]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic already handled by useEffect
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Discovery Engine
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            AI-powered content discovery across all platforms
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for content, topics, or hashtags..."
              className="w-full pl-12 pr-16 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-primary-500 transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
          </form>
        </motion.div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Source
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg"
                >
                  {contentSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Content Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg"
                >
                  {contentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Time Range
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg"
                >
                  {timeRanges.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <div className="space-y-6">
          {content.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Thumbnail */}
                <div className="lg:w-64 flex-shrink-0">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-48 lg:h-36 object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'video' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          item.type === 'article' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {item.source} • {item.author}
                        </span>
                      </div>
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        {item.title}
                      </h2>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-5 h-5 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                      <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        AI Summary
                      </span>
                    </div>
                    <p className="text-sm text-primary-600 dark:text-primary-400">
                      {item.aiSummary}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Engagement & Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {item.engagement.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {item.engagement.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {item.engagement.comments}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {item.timestamp}
                      </span>
                      {item.readTime && (
                        <span>{item.readTime} read</span>
                      )}
                      {item.duration && (
                        <span>{item.duration}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-primary-500 transition-colors">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-primary-500 transition-colors">
                        <Share className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
            Load More Content
          </button>
        </motion.div>
      </div>
    </div>
  );
}