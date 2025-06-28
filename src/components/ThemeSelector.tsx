import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check, Monitor, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { currentTheme, themes, isDark, setTheme, toggleTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Themes', icon: '🎨' },
    { id: 'fantasy', name: 'Fantasy', icon: '⚔️' },
    { id: 'sci-fi', name: 'Sci-Fi', icon: '🚀' },
    { id: 'crime', name: 'Crime', icon: '🕵️' },
    { id: 'horror', name: 'Horror', icon: '👻' },
    { id: 'action', name: 'Action', icon: '💥' }
  ];

  const getThemeCategory = (themeId: string) => {
    switch (themeId) {
      case 'got':
      case 'witcher':
      case 'vikings':
        return 'fantasy';
      case 'stranger-things':
      case 'mandalorian':
      case 'cyberpunk':
        return 'sci-fi';
      case 'breaking-bad':
        return 'crime';
      default:
        return 'all';
    }
  };

  const filteredThemes = selectedCategory === 'all' 
    ? themes 
    : themes.filter(theme => getThemeCategory(theme.id) === selectedCategory || theme.id === 'default');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className="text-white p-6 relative overflow-hidden"
              style={{ 
                background: `var(--gradient-button)`,
                boxShadow: `var(--effect-glow)`
              }}
            >
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              </div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Palette className="w-8 h-8" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-primary)' }}>
                      Theme Universe
                    </h2>
                    <p className="text-white/80">
                      Transform your A4all experience with cinematic themes
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-64 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                          selectedCategory === category.id
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-md'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Dark Mode Toggle */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Display Mode
                  </h3>
                  <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
                  >
                    <motion.div
                      animate={{ rotate: isDark ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </motion.div>
                    <span className="font-medium">
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Theme Grid */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredThemes.map((theme, index) => (
                    <motion.div
                      key={theme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className={`relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-500 cursor-pointer group ${
                        currentTheme.id === theme.id
                          ? 'border-primary-500 shadow-2xl'
                          : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                      onClick={() => setTheme(theme.id)}
                      style={{
                        boxShadow: currentTheme.id === theme.id ? theme.effects.glow : undefined
                      }}
                    >
                      {/* Preview Image with Overlay */}
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={theme.backgroundImage}
                          alt={theme.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div 
                          className="absolute inset-0"
                          style={{ background: theme.backgroundOverlay }}
                        />
                        <div 
                          className="absolute inset-0 opacity-80"
                          style={{ background: theme.gradients.hero }}
                        />
                        
                        {/* Series Badge */}
                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
                          {theme.series}
                        </div>
                        
                        {/* Selected Indicator */}
                        {currentTheme.id === theme.id && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ 
                              background: theme.colors.primary,
                              boxShadow: theme.effects.glow
                            }}
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}

                        {/* Theme Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <h3 
                            className="font-bold text-white text-lg"
                            style={{ 
                              fontFamily: theme.fonts.primary,
                              textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                            }}
                          >
                            {theme.name}
                          </h3>
                        </div>
                      </div>

                      {/* Theme Info */}
                      <div className="p-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {theme.description}
                        </p>

                        {/* Color Palette */}
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                              style={{ backgroundColor: theme.colors.primary }}
                              title="Primary Color"
                            />
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                              style={{ backgroundColor: theme.colors.secondary }}
                              title="Secondary Color"
                            />
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                              style={{ backgroundColor: theme.colors.accent }}
                              title="Accent Color"
                            />
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                              style={{ backgroundColor: theme.colors.surface }}
                              title="Surface Color"
                            />
                          </div>
                          
                          {/* Font Preview */}
                          <div 
                            className="text-xs text-slate-500 dark:text-slate-400"
                            style={{ fontFamily: theme.fonts.primary }}
                          >
                            {theme.fonts.primary.split(',')[0]}
                          </div>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ 
                          background: `linear-gradient(45deg, ${theme.colors.primary}10, ${theme.colors.secondary}10)`,
                          boxShadow: `inset 0 0 20px ${theme.colors.primary}30`
                        }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Current Theme Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 p-6 rounded-2xl border relative overflow-hidden"
                  style={{
                    background: currentTheme.gradients.card,
                    borderColor: currentTheme.colors.border,
                    boxShadow: currentTheme.effects.shadow
                  }}
                >
                  <div className="absolute inset-0 opacity-10">
                    <img
                      src={currentTheme.backgroundImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="relative">
                    <h3 
                      className="text-xl font-bold mb-2"
                      style={{ 
                        color: currentTheme.colors.primary,
                        fontFamily: currentTheme.fonts.primary
                      }}
                    >
                      🎬 Currently Active: {currentTheme.name}
                    </h3>
                    <p 
                      className="mb-4"
                      style={{ color: currentTheme.colors.text }}
                    >
                      {currentTheme.description}
                    </p>
                    <div 
                      className="flex items-center space-x-4 text-sm"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      <span>📺 Series: {currentTheme.series}</span>
                      <span>•</span>
                      <span>🎨 Font: {currentTheme.fonts.primary.split(',')[0]}</span>
                      <span>•</span>
                      <span>✨ Effects: Enhanced</span>
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