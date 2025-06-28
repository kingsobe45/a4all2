import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Star, 
  Filter, 
  Search, 
  Heart, 
  Download, 
  Eye, 
  TrendingUp, 
  Zap, 
  Crown, 
  Shield, 
  Sparkles,
  Package,
  Users,
  Clock,
  DollarSign,
  Tag,
  Gift,
  Award,
  Bookmark,
  Share2,
  ChevronDown,
  Grid3X3,
  List,
  SortAsc
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

const categories = [
  { id: 'all', name: 'All Items', icon: Package, color: '#8b5cf6' },
  { id: 'themes', name: 'Themes', icon: Sparkles, color: '#06b6d4' },
  { id: 'ai-tools', name: 'AI Tools', icon: Zap, color: '#f37316' },
  { id: 'games', name: 'Games', icon: Crown, color: '#d4af37' },
  { id: 'plugins', name: 'Plugins', icon: Shield, color: '#10b981' },
  { id: 'templates', name: 'Templates', icon: Grid3X3, color: '#8b0000' },
  { id: 'premium', name: 'Premium', icon: Award, color: '#9d4edd' }
];

const sortOptions = [
  { id: 'popular', name: 'Most Popular', icon: TrendingUp },
  { id: 'newest', name: 'Newest First', icon: Clock },
  { id: 'price-low', name: 'Price: Low to High', icon: DollarSign },
  { id: 'price-high', name: 'Price: High to Low', icon: DollarSign },
  { id: 'rating', name: 'Highest Rated', icon: Star },
  { id: 'downloads', name: 'Most Downloaded', icon: Download }
];

const marketplaceItems = [
  {
    id: 1,
    title: 'Cyberpunk 2077 Theme Pack',
    category: 'themes',
    description: 'Complete Night City experience with neon animations, custom fonts, and immersive soundscapes',
    price: 9.99,
    originalPrice: 14.99,
    rating: 4.9,
    reviews: 2847,
    downloads: 45230,
    image: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'NeonDesigns',
    authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    tags: ['Cyberpunk', 'Neon', 'Futuristic', 'Animated'],
    featured: true,
    premium: true,
    discount: 33,
    type: 'theme',
    compatibility: ['Desktop', 'Mobile', 'Tablet'],
    lastUpdated: '2024-01-15',
    version: '2.1.0'
  },
  {
    id: 2,
    title: 'AI Content Generator Pro',
    category: 'ai-tools',
    description: 'Advanced AI tool for generating high-quality content, articles, and creative writing with GPT-4 integration',
    price: 29.99,
    rating: 4.8,
    reviews: 1523,
    downloads: 18750,
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'AIInnovators',
    authorAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    tags: ['AI', 'Content', 'Writing', 'GPT-4'],
    featured: true,
    premium: true,
    type: 'tool',
    compatibility: ['All Platforms'],
    lastUpdated: '2024-01-20',
    version: '3.2.1'
  },
  {
    id: 3,
    title: 'Quantum Chess Master',
    category: 'games',
    description: 'Revolutionary chess game with quantum mechanics, multiple dimensions, and AI opponents',
    price: 19.99,
    rating: 4.7,
    reviews: 892,
    downloads: 12450,
    image: 'https://images.pexels.com/photos/163064/pexels-photo-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'QuantumGames',
    authorAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    tags: ['Chess', 'Quantum', 'Strategy', 'AI'],
    featured: false,
    premium: true,
    type: 'game',
    compatibility: ['Desktop', 'Mobile'],
    lastUpdated: '2024-01-18',
    version: '1.5.2'
  },
  {
    id: 4,
    title: 'Medieval Fantasy UI Kit',
    category: 'templates',
    description: 'Complete UI kit with medieval fantasy elements, perfect for RPG games and fantasy applications',
    price: 0,
    rating: 4.6,
    reviews: 1247,
    downloads: 34560,
    image: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'FantasyDesigns',
    authorAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    tags: ['Medieval', 'Fantasy', 'UI Kit', 'Free'],
    featured: false,
    premium: false,
    type: 'template',
    compatibility: ['All Platforms'],
    lastUpdated: '2024-01-12',
    version: '2.0.0'
  },
  {
    id: 5,
    title: 'Smart Analytics Dashboard',
    category: 'plugins',
    description: 'Advanced analytics plugin with real-time data visualization, custom charts, and AI insights',
    price: 39.99,
    rating: 4.9,
    reviews: 567,
    downloads: 8920,
    image: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'DataViz Pro',
    authorAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
    tags: ['Analytics', 'Dashboard', 'Data', 'Charts'],
    featured: true,
    premium: true,
    type: 'plugin',
    compatibility: ['Desktop', 'Web'],
    lastUpdated: '2024-01-22',
    version: '4.1.0'
  },
  {
    id: 6,
    title: 'Retro 80s Synthwave Pack',
    category: 'themes',
    description: 'Nostalgic 80s synthwave theme with neon grids, retro fonts, and synthwave music integration',
    price: 12.99,
    rating: 4.8,
    reviews: 1834,
    downloads: 28340,
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
    author: 'RetroWave',
    authorAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100',
    tags: ['80s', 'Synthwave', 'Retro', 'Neon'],
    featured: false,
    premium: true,
    type: 'theme',
    compatibility: ['Desktop', 'Mobile'],
    lastUpdated: '2024-01-10',
    version: '1.8.3'
  }
];

export default function Marketplace() {
  const { currentTheme } = useTheme();
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filteredItems = marketplaceItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => item.tags.includes(tag));
    
    return matchesCategory && matchesSearch && matchesPrice && matchesTags;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'downloads':
        return b.downloads - a.downloads;
      default:
        return b.downloads - a.downloads; // Popular = most downloads
    }
  });

  const addToCart = (itemId: number) => {
    setCart(prev => prev.includes(itemId) ? prev : [...prev, itemId]);
  };

  const toggleWishlist = (itemId: number) => {
    setWishlist(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const allTags = Array.from(new Set(marketplaceItems.flatMap(item => item.tags)));

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ 
              fontFamily: currentTheme.fonts.heading,
              color: currentTheme.colors.text
            }}
          >
            <span 
              className="bg-gradient-to-r bg-clip-text text-transparent"
              style={{ 
                backgroundImage: currentTheme.gradients.button
              }}
            >
              🛒 Marketplace
            </span>
          </h1>
          <p 
            className="text-xl mb-8"
            style={{ 
              color: currentTheme.colors.textSecondary,
              fontFamily: currentTheme.fonts.body
            }}
          >
            Discover premium themes, AI tools, games, and plugins to enhance your A4all experience
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: 'Total Items', value: '2.5K+', icon: Package },
              { label: 'Active Users', value: '150K+', icon: Users },
              { label: 'Downloads', value: '1M+', icon: Download },
              { label: 'Creators', value: '500+', icon: Award }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl text-center"
                  style={{ 
                    background: currentTheme.gradients.card,
                    border: `1px solid ${currentTheme.colors.border}`
                  }}
                >
                  <Icon 
                    className="w-6 h-6 mx-auto mb-2" 
                    style={{ color: currentTheme.colors.primary }}
                  />
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
              style={{ color: currentTheme.colors.textSecondary }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search themes, tools, games, and more..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-lg focus:ring-2 focus:outline-none transition-all duration-300"
              style={{
                background: currentTheme.gradients.card,
                border: `1px solid ${currentTheme.colors.border}`,
                color: currentTheme.colors.text,
                fontFamily: currentTheme.fonts.body
              }}
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300`}
                  style={{
                    background: selectedCategory === category.id 
                      ? currentTheme.gradients.button
                      : currentTheme.gradients.card,
                    color: selectedCategory === category.id 
                      ? '#ffffff'
                      : currentTheme.colors.text,
                    border: `1px solid ${selectedCategory === category.id ? 'transparent' : currentTheme.colors.border}`,
                    boxShadow: selectedCategory === category.id ? currentTheme.effects.glow : 'none'
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: category.color }} />
                  <span>{category.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300"
                style={{
                  background: currentTheme.gradients.card,
                  border: `1px solid ${currentTheme.colors.border}`,
                  color: currentTheme.colors.text
                }}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-xl focus:outline-none transition-all duration-300"
                style={{
                  background: currentTheme.gradients.card,
                  border: `1px solid ${currentTheme.colors.border}`,
                  color: currentTheme.colors.text
                }}
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span 
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {sortedItems.length} items
              </span>
              <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: currentTheme.colors.border }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'opacity-100' : 'opacity-50'}`}
                  style={{ 
                    background: viewMode === 'grid' ? currentTheme.colors.primary : 'transparent',
                    color: viewMode === 'grid' ? '#ffffff' : currentTheme.colors.text
                  }}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'opacity-100' : 'opacity-50'}`}
                  style={{ 
                    background: viewMode === 'list' ? currentTheme.colors.primary : 'transparent',
                    color: viewMode === 'list' ? '#ffffff' : currentTheme.colors.text
                  }}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-6 rounded-2xl"
                style={{
                  background: currentTheme.gradients.card,
                  border: `1px solid ${currentTheme.colors.border}`
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: currentTheme.colors.text }}
                    >
                      Price Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div 
                        className="text-sm"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        $0 - ${priceRange[1]}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: currentTheme.colors.text }}
                    >
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                      {allTags.slice(0, 10).map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTags(prev => 
                            prev.includes(tag) 
                              ? prev.filter(t => t !== tag)
                              : [...prev, tag]
                          )}
                          className={`px-2 py-1 rounded-lg text-xs transition-all duration-300`}
                          style={{
                            background: selectedTags.includes(tag) 
                              ? currentTheme.colors.primary
                              : `${currentTheme.colors.primary}20`,
                            color: selectedTags.includes(tag) 
                              ? '#ffffff'
                              : currentTheme.colors.text
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: currentTheme.colors.text }}
                    >
                      Quick Filters
                    </label>
                    <div className="space-y-2">
                      {['Free Only', 'Premium Only', 'Featured', 'Recently Updated'].map(filter => (
                        <label key={filter} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span 
                            className="text-sm"
                            style={{ color: currentTheme.colors.text }}
                          >
                            {filter}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Items Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            : 'space-y-6'
          }
        >
          {sortedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
              style={{
                background: currentTheme.gradients.card,
                border: `1px solid ${currentTheme.colors.border}`,
                boxShadow: currentTheme.effects.shadow
              }}
            >
              {/* Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'} overflow-hidden`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {item.featured && (
                    <span 
                      className="px-2 py-1 rounded-lg text-xs font-bold text-white"
                      style={{ background: currentTheme.colors.accent }}
                    >
                      ⭐ Featured
                    </span>
                  )}
                  {item.premium && (
                    <span 
                      className="px-2 py-1 rounded-lg text-xs font-bold text-white"
                      style={{ background: currentTheme.colors.primary }}
                    >
                      👑 Premium
                    </span>
                  )}
                  {item.discount && (
                    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-red-500 text-white">
                      -{item.discount}%
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300"
                  style={{ 
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: wishlist.includes(item.id) ? '#ff4757' : '#ffffff'
                  }}
                >
                  <Heart className={`w-4 h-4 ${wishlist.includes(item.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-2 rounded-full backdrop-blur-md"
                    style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <Eye className="w-4 h-4 text-white" />
                  </button>
                  <button 
                    className="p-2 rounded-full backdrop-blur-md"
                    style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 
                      className="text-xl font-semibold mb-2 line-clamp-2"
                      style={{ 
                        color: currentTheme.colors.text,
                        fontFamily: currentTheme.fonts.heading
                      }}
                    >
                      {item.title}
                    </h3>
                    <p 
                      className="text-sm mb-3 line-clamp-2"
                      style={{ 
                        color: currentTheme.colors.textSecondary,
                        fontFamily: currentTheme.fonts.body
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center space-x-2 mb-4">
                  <img
                    src={item.authorAvatar}
                    alt={item.author}
                    className="w-6 h-6 rounded-full"
                  />
                  <span 
                    className="text-sm font-medium"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {item.author}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {item.rating} ({item.reviews})
                  </span>
                  <span className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    {item.downloads.toLocaleString()}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-lg text-xs"
                      style={{
                        background: `${currentTheme.colors.primary}20`,
                        color: currentTheme.colors.primary
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    {item.price === 0 ? (
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: currentTheme.colors.primary }}
                      >
                        FREE
                      </span>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: currentTheme.colors.text }}
                        >
                          ${item.price}
                        </span>
                        {item.originalPrice && (
                          <span 
                            className="text-sm line-through"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            ${item.originalPrice}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(item.id)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300"
                      style={{
                        background: cart.includes(item.id) 
                          ? currentTheme.colors.accent
                          : currentTheme.gradients.button,
                        color: '#ffffff',
                        boxShadow: currentTheme.effects.glow
                      }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{cart.includes(item.id) ? 'Added' : item.price === 0 ? 'Get' : 'Buy'}</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <button 
            className="px-8 py-3 rounded-xl font-medium transition-all duration-300"
            style={{
              background: currentTheme.gradients.button,
              color: '#ffffff',
              boxShadow: currentTheme.effects.glow
            }}
          >
            Load More Items
          </button>
        </motion.div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 p-4 rounded-2xl shadow-2xl z-50"
            style={{
              background: currentTheme.gradients.card,
              border: `1px solid ${currentTheme.colors.border}`,
              boxShadow: currentTheme.effects.shadow
            }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-full"
                style={{ background: currentTheme.colors.primary }}
              >
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <div 
                  className="font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {cart.length} items in cart
                </div>
                <div 
                  className="text-sm"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  ${cart.reduce((total, id) => {
                    const item = marketplaceItems.find(i => i.id === id);
                    return total + (item?.price || 0);
                  }, 0).toFixed(2)}
                </div>
              </div>
              <button 
                className="px-4 py-2 rounded-lg font-medium text-white transition-all duration-300"
                style={{ background: currentTheme.colors.primary }}
              >
                Checkout
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}