import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X, Check, Monitor, Moon, Sun } from 'lucide-react';
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
    { id: 'horror', name: 'Horror', icon: '👻' }
  ];

  const getThemeCategory = (themeId: string) => {
    switch (themeId) {
      case 'got':
      case 'witcher':
        return 'fantasy';
      case 'stranger-things':
      case 'mandalorian':
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
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
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Palette className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Theme Gallery</h2>
                    <p className="text-primary-100">Choose your perfect visual experience</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
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
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dark Mode Toggle */}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    Display Mode
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <span className="font-medium">
                        {isDark ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Theme Grid */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredThemes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      className={`relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border-2 transition-all duration-300 cursor-pointer ${
                        currentTheme.id === theme.id
                          ? 'border-primary-500 shadow-xl'
                          : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                      onClick={() => setTheme(theme.id)}
                    >
                      {/* Preview Image */}
                      <div className="relative h-32 overflow-hidden">
                        <div
                          className="w-full h-full"
                          style={{ background: theme.gradients.hero }}
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        <img
                          src={theme.preview}
                          alt={theme.name}
                          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                        />
                        
                        {/* Selected Indicator */}
                        {currentTheme.id === theme.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                      </div>

                      {/* Theme Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                              {theme.name}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {theme.series}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          {theme.description}
                        </p>

                        {/* Color Palette */}
                        <div className="flex space-x-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: theme.colors.primary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: theme.colors.secondary }}
                          />
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: theme.colors.accent }}
                          />
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: theme.colors.surface }}
                          />
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-primary-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(to top, ${theme.colors.primary}20, transparent)` }}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Current Theme Info */}
                <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-2xl border border-primary-200 dark:border-primary-700">
                  <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200 mb-2">
                    Currently Active: {currentTheme.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-4">
                    {currentTheme.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-primary-700 dark:text-primary-300">
                    <span>Series: {currentTheme.series}</span>
                    <span>•</span>
                    <span>Font: {currentTheme.fonts.primary.split(',')[0]}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}