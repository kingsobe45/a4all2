import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check, Monitor, Moon, Sun, Sparkles, Zap, Crown, Sword, Atom, Skull, Rocket, Eye, Minimize2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { currentTheme, themes, isDark, setTheme, toggleTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Themes', icon: Palette, color: '#8b5cf6' },
    { id: 'original', name: 'Original', icon: Minimize2, color: '#06b6d4' },
    { id: 'fantasy', name: 'Fantasy', icon: Crown, color: '#d4af37' },
    { id: 'sci-fi', name: 'Sci-Fi', icon: Rocket, color: '#4a9eff' },
    { id: 'crime', name: 'Crime', icon: Eye, color: '#00ff41' },
    { id: 'horror', name: 'Horror', icon: Skull, color: '#ff073a' },
    { id: 'action', name: 'Action', icon: Zap, color: '#8b0000' },
    { id: 'cyberpunk', name: 'Cyberpunk', icon: Atom, color: '#00ffff' }
  ];

  const getThemeCategory = (themeId: string) => {
    switch (themeId) {
      case 'simple':
      case 'default':
        return 'original';
      case 'got':
      case 'witcher':
      case 'vikings':
        return 'fantasy';
      case 'stranger-things':
      case 'mandalorian':
      case 'avatar':
        return 'sci-fi';
      case 'breaking-bad':
        return 'crime';
      case 'cyberpunk':
      case 'matrix':
        return 'cyberpunk';
      default:
        return 'all';
    }
  };

  const filteredThemes = selectedCategory === 'all' 
    ? themes 
    : themes.filter(theme => getThemeCategory(theme.id) === selectedCategory);

  const getThemeEmoji = (themeId: string) => {
    switch (themeId) {
      case 'simple': return '✨';
      case 'default': return '🌟';
      case 'got': return '🐉';
      case 'breaking-bad': return '⚗️';
      case 'witcher': return '🗡️';
      case 'stranger-things': return '👻';
      case 'mandalorian': return '🚀';
      case 'cyberpunk': return '🤖';
      case 'vikings': return '⚔️';
      case 'matrix': return '💊';
      case 'avatar': return '🌿';
      default: return '🎨';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 rounded-3xl shadow-2xl border z-50 overflow-hidden"
            style={{
              background: currentTheme.gradients.card,
              borderColor: currentTheme.colors.border,
              boxShadow: currentTheme.effects.shadow
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className="text-white p-6 relative overflow-hidden"
              style={{ 
                background: currentTheme.gradients.button,
                boxShadow: currentTheme.effects.glow
              }}
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <motion.div 
                  className="absolute inset-0"
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    repeatType: 'reverse' 
                  }}
                  style={{
                    background: `radial-gradient(circle at 20% 50%, ${currentTheme.colors.secondary}40 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${currentTheme.colors.accent}40 0%, transparent 50%), radial-gradient(circle at 40% 80%, ${currentTheme.colors.primary}40 0%, transparent 50%)`,
                    backgroundSize: '100% 100%'
                  }}
                />
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="p-3 rounded-2xl"
                    style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <Palette className="w-8 h-8" />
                  </motion.div>
                  <div>
                    <h2 
                      className="text-3xl font-bold mb-1" 
                      style={{ fontFamily: currentTheme.fonts.primary }}
                    >
                      🎬 Theme Universe
                    </h2>
                    <p className="text-white/90 text-lg">
                      Transform A4all into your favorite cinematic world
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex h-full">
              {/* Sidebar */}
              <div 
                className="w-80 border-r p-6 overflow-y-auto"
                style={{ 
                  background: currentTheme.gradients.overlay,
                  borderColor: currentTheme.colors.border
                }}
              >
                <div className="mb-8">
                  <h3 
                    className="text-xl font-semibold mb-6 flex items-center"
                    style={{ color: currentTheme.colors.text }}
                  >
                    <Sparkles className="w-6 h-6 mr-3" style={{ color: currentTheme.colors.primary }} />
                    Categories
                  </h3>
                  <div className="space-y-3">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <motion.button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          whileHover={{ scale: 1.03, x: 5 }}
                          whileTap={{ scale: 0.97 }}
                          className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                            selectedCategory === category.id
                              ? 'shadow-lg'
                              : 'hover:shadow-md'
                          }`}
                          style={{
                            background: selectedCategory === category.id 
                              ? currentTheme.gradients.button
                              : 'rgba(255, 255, 255, 0.05)',
                            color: selectedCategory === category.id 
                              ? '#ffffff'
                              : currentTheme.colors.text,
                            boxShadow: selectedCategory === category.id 
                              ? currentTheme.effects.glow
                              : 'none'
                          }}
                        >
                          <Icon className="w-5 h-5" style={{ color: category.color }} />
                          <span className="font-medium text-lg">{category.name}</span>
                          {selectedCategory === category.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto"
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Dark Mode Toggle */}
                <div 
                  className="border-t pt-6"
                  style={{ borderColor: currentTheme.colors.border }}
                >
                  <h3 
                    className="text-xl font-semibold mb-4"
                    style={{ color: currentTheme.colors.text }}
                  >
                    Display Mode
                  </h3>
                  <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: currentTheme.colors.text
                    }}
                  >
                    <motion.div
                      animate={{ rotate: isDark ? 180 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </motion.div>
                    <span className="font-medium text-lg">
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Theme Grid */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredThemes.map((theme, index) => (
                    <motion.div
                      key={theme.id}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1, type: 'spring', damping: 20 }}
                      whileHover={{ y: -12, scale: 1.03 }}
                      className={`relative rounded-3xl overflow-hidden shadow-xl border-2 transition-all duration-500 cursor-pointer group ${
                        currentTheme.id === theme.id
                          ? 'ring-4'
                          : 'hover:shadow-2xl'
                      }`}
                      onClick={() => setTheme(theme.id)}
                      style={{
                        background: theme.gradients.card,
                        borderColor: currentTheme.id === theme.id ? theme.colors.primary : theme.colors.border,
                        boxShadow: currentTheme.id === theme.id ? theme.effects.glow : theme.effects.shadow,
                        ringColor: currentTheme.id === theme.id ? theme.colors.primary : 'transparent'
                      }}
                    >
                      {/* Preview Image with Dynamic Overlay */}
                      <div className="relative h-48 overflow-hidden">
                        {theme.backgroundImage ? (
                          <>
                            <motion.img
                              src={theme.backgroundImage}
                              alt={theme.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              whileHover={{ scale: 1.1 }}
                            />
                            
                            {/* Dynamic Gradient Overlay */}
                            <div 
                              className="absolute inset-0 transition-opacity duration-500"
                              style={{ background: theme.backgroundOverlay }}
                            />
                            
                            <motion.div 
                              className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                              style={{ background: theme.gradients.hero }}
                            />
                          </>
                        ) : (
                          // Simple theme preview with gradient
                          <motion.div 
                            className="w-full h-full transition-opacity duration-500"
                            style={{ background: theme.gradients.hero }}
                          />
                        )}
                        
                        {/* Series Badge */}
                        <div 
                          className="absolute top-4 left-4 px-3 py-2 rounded-xl text-sm font-bold backdrop-blur-md"
                          style={{ 
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: theme.colors.primary,
                            border: `1px solid ${theme.colors.primary}40`
                          }}
                        >
                          {getThemeEmoji(theme.id)} {theme.series}
                        </div>
                        
                        {/* Selected Indicator */}
                        {currentTheme.id === theme.id && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md"
                            style={{ 
                              background: theme.colors.primary,
                              boxShadow: theme.effects.glow
                            }}
                          >
                            <Check className="w-6 h-6 text-white" />
                          </motion.div>
                        )}

                        {/* Theme Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                          <h3 
                            className="font-bold text-white text-xl mb-1"
                            style={{ 
                              fontFamily: theme.fonts.primary,
                              textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                            }}
                          >
                            {theme.name}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {theme.description}
                          </p>
                        </div>
                      </div>

                      {/* Theme Details */}
                      <div className="p-5">
                        {/* Color Palette */}
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex space-x-2">
                            {[theme.colors.primary, theme.colors.secondary, theme.colors.accent, theme.colors.surface].map((color, i) => (
                              <motion.div
                                key={i}
                                whileHover={{ scale: 1.3, y: -2 }}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer"
                                style={{ backgroundColor: color }}
                                title={['Primary', 'Secondary', 'Accent', 'Surface'][i]}
                              />
                            ))}
                          </div>
                          
                          {/* Font Preview */}
                          <div 
                            className="text-sm font-medium px-3 py-1 rounded-lg"
                            style={{ 
                              fontFamily: theme.fonts.primary,
                              color: theme.colors.textSecondary,
                              background: `${theme.colors.primary}20`
                            }}
                          >
                            {theme.fonts.primary.split(',')[0]}
                          </div>
                        </div>

                        {/* Theme Stats */}
                        <div className="flex justify-between text-sm">
                          <span style={{ color: theme.colors.textSecondary }}>
                            🎨 {getThemeCategory(theme.id).charAt(0).toUpperCase() + getThemeCategory(theme.id).slice(1)}
                          </span>
                          <span style={{ color: theme.colors.textSecondary }}>
                            {theme.id === 'simple' ? '🧹 Minimal' : '✨ Enhanced'}
                          </span>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                        style={{ 
                          background: `linear-gradient(45deg, ${theme.colors.primary}15, ${theme.colors.secondary}15, ${theme.colors.accent}15)`,
                          boxShadow: `inset 0 0 30px ${theme.colors.primary}30`
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Current Theme Showcase */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 p-8 rounded-3xl border relative overflow-hidden"
                  style={{
                    background: currentTheme.gradients.card,
                    borderColor: currentTheme.colors.border,
                    boxShadow: currentTheme.effects.shadow
                  }}
                >
                  {/* Background Pattern */}
                  {currentTheme.backgroundImage && (
                    <div className="absolute inset-0 opacity-5">
                      <img
                        src={currentTheme.backgroundImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="relative">
                    <div className="flex items-center space-x-4 mb-4">
                      <div 
                        className="text-4xl p-3 rounded-2xl"
                        style={{ background: `${currentTheme.colors.primary}20` }}
                      >
                        {getThemeEmoji(currentTheme.id)}
                      </div>
                      <div>
                        <h3 
                          className="text-2xl font-bold mb-2"
                          style={{ 
                            color: currentTheme.colors.primary,
                            fontFamily: currentTheme.fonts.primary
                          }}
                        >
                          Currently Active: {currentTheme.name}
                        </h3>
                        <p 
                          className="text-lg"
                          style={{ color: currentTheme.colors.text }}
                        >
                          {currentTheme.description}
                        </p>
                      </div>
                    </div>
                    
                    <div 
                      className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      <div>📺 <strong>Series:</strong> {currentTheme.series}</div>
                      <div>🎨 <strong>Font:</strong> {currentTheme.fonts.primary.split(',')[0]}</div>
                      <div>✨ <strong>Effects:</strong> {currentTheme.id === 'simple' ? 'Minimal' : 'Enhanced'}</div>
                      <div>🌟 <strong>Status:</strong> Active</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}