import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Lock, 
  LogOut,
  ChevronRight,
  X,
  Save,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';

interface LoginSettingsProps {
  className?: string;
}

interface SettingsData {
  profile: {
    username: string;
    email: string;
    bio: string;
    avatar: string;
  };
  preferences: {
    language: string;
    timezone: string;
    dateFormat: string;
    autoSave: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showEmail: boolean;
    showActivity: boolean;
    allowMessages: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
    updates: boolean;
  };
  display: {
    theme: string;
    fontSize: 'small' | 'medium' | 'large';
    animations: boolean;
    compactMode: boolean;
  };
}

export default function LoginSettings({ className = '' }: LoginSettingsProps) {
  const { currentTheme } = useTheme();
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      username: user?.username || '',
      email: user?.email || '',
      bio: 'AI enthusiast and tech explorer',
      avatar: user?.avatar || ''
    },
    preferences: {
      language: 'English',
      timezone: 'UTC-5 (EST)',
      dateFormat: 'MM/DD/YYYY',
      autoSave: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showActivity: true,
      allowMessages: true
    },
    notifications: {
      email: true,
      push: true,
      marketing: false,
      updates: true
    },
    display: {
      theme: currentTheme.id,
      fontSize: 'medium',
      animations: true,
      compactMode: false
    }
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSection(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettingChange = (section: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    
    if (!passwordData.current) {
      newErrors.current = 'Current password is required';
    }
    
    if (!passwordData.new) {
      newErrors.new = 'New password is required';
    } else if (passwordData.new.length < 8) {
      newErrors.new = 'Password must be at least 8 characters';
    }
    
    if (passwordData.new !== passwordData.confirm) {
      newErrors.confirm = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save to localStorage for persistence
    localStorage.setItem('a4all-settings', JSON.stringify(settings));
    
    setHasChanges(false);
    setIsSaving(false);
    setSaveSuccess(true);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordChange = async () => {
    if (!validatePassword()) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowPasswordChange(false);
    setIsSaving(false);
    setSaveSuccess(true);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const settingSections = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
      description: 'Manage your personal information'
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: Settings,
      description: 'Customize your experience'
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: Shield,
      description: 'Control your privacy settings'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage notification preferences'
    },
    {
      id: 'display',
      title: 'Display',
      icon: Palette,
      description: 'Customize appearance'
    }
  ];

  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  const timezones = ['UTC-8 (PST)', 'UTC-5 (EST)', 'UTC+0 (GMT)', 'UTC+1 (CET)', 'UTC+8 (CST)'];
  const dateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

  if (!user) {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`p-2 rounded-lg transition-all duration-300 ${className}`}
        style={{
          color: currentTheme.colors.textSecondary,
          background: 'transparent'
        }}
        onClick={() => {/* Handle login */}}
      >
        <User className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Login Icon */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-lg transition-all duration-300 group"
        style={{
          background: isOpen ? currentTheme.colors.primary : 'transparent',
          color: isOpen ? '#ffffff' : currentTheme.colors.textSecondary
        }}
        aria-label="User settings"
      >
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-6 h-6 rounded-full object-cover border-2 transition-all duration-300"
            style={{ 
              borderColor: isOpen ? '#ffffff' : currentTheme.colors.border
            }}
          />
          {hasChanges && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          )}
        </div>
      </motion.button>

      {/* Settings Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute top-12 right-0 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden"
            style={{
              background: currentTheme.gradients.card,
              borderColor: currentTheme.colors.border,
              boxShadow: currentTheme.effects.shadow
            }}
          >
            {/* Header */}
            <div 
              className="p-4 border-b"
              style={{ 
                background: currentTheme.gradients.button,
                borderColor: currentTheme.colors.border
              }}
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{user.username}</h3>
                  <p className="text-sm text-white/80">{user.email}</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
              {!activeSection ? (
                // Main Menu
                <div className="p-2">
                  {settingSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        whileHover={{ x: 4 }}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group"
                        style={{
                          color: currentTheme.colors.text,
                          background: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${currentTheme.colors.primary}10`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <Icon 
                          className="w-5 h-5 transition-colors"
                          style={{ color: currentTheme.colors.primary }}
                        />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{section.title}</div>
                          <div 
                            className="text-sm"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            {section.description}
                          </div>
                        </div>
                        <ChevronRight 
                          className="w-4 h-4 transition-transform group-hover:translate-x-1"
                          style={{ color: currentTheme.colors.textSecondary }}
                        />
                      </motion.button>
                    );
                  })}

                  {/* Password Change */}
                  <motion.button
                    onClick={() => setShowPasswordChange(true)}
                    whileHover={{ x: 4 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group"
                    style={{
                      color: currentTheme.colors.text,
                      background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${currentTheme.colors.primary}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Lock 
                      className="w-5 h-5"
                      style={{ color: currentTheme.colors.primary }}
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium">Change Password</div>
                      <div 
                        className="text-sm"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        Update your account password
                      </div>
                    </div>
                    <ChevronRight 
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      style={{ color: currentTheme.colors.textSecondary }}
                    />
                  </motion.button>

                  {/* Logout */}
                  <div 
                    className="border-t mt-2 pt-2"
                    style={{ borderColor: currentTheme.colors.border }}
                  >
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ x: 4 }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                // Settings Sections
                <div className="p-4">
                  {/* Back Button */}
                  <button
                    onClick={() => setActiveSection(null)}
                    className="flex items-center space-x-2 mb-4 text-sm transition-colors"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    <span>Back</span>
                  </button>

                  {/* Profile Settings */}
                  {activeSection === 'profile' && (
                    <div className="space-y-4">
                      <h3 
                        className="font-semibold text-lg"
                        style={{ color: currentTheme.colors.text }}
                      >
                        Profile Settings
                      </h3>
                      
                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          value={settings.profile.username}
                          onChange={(e) => handleSettingChange('profile', 'username', e.target.value)}
                          className="w-full p-2 rounded-lg border focus:ring-2 focus:outline-none"
                          style={{
                            background: currentTheme.colors.surface,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        />
                      </div>

                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          value={settings.profile.email}
                          onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                          className="w-full p-2 rounded-lg border focus:ring-2 focus:outline-none"
                          style={{
                            background: currentTheme.colors.surface,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        />
                      </div>

                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Bio
                        </label>
                        <textarea
                          value={settings.profile.bio}
                          onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                          rows={3}
                          className="w-full p-2 rounded-lg border focus:ring-2 focus:outline-none resize-none"
                          style={{
                            background: currentTheme.colors.surface,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Preferences Settings */}
                  {activeSection === 'preferences' && (
                    <div className="space-y-4">
                      <h3 
                        className="font-semibold text-lg"
                        style={{ color: currentTheme.colors.text }}
                      >
                        Preferences
                      </h3>
                      
                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Language
                        </label>
                        <select
                          value={settings.preferences.language}
                          onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                          className="w-full p-2 rounded-lg border focus:ring-2 focus:outline-none"
                          style={{
                            background: currentTheme.colors.surface,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        >
                          {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Timezone
                        </label>
                        <select
                          value={settings.preferences.timezone}
                          onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                          className="w-full p-2 rounded-lg border focus:ring-2 focus:outline-none"
                          style={{
                            background: currentTheme.colors.surface,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        >
                          {timezones.map(tz => (
                            <option key={tz} value={tz}>{tz}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Date Format
                        </label>
                        <select
                          value={settings.preferences.dateFormat}
                          onChange={(e) => handleSettingChange('preferences', 'dateFormat', e.target.value)}
                          className="w-full p-2 rounded-lg border focus:ring-2 focus:outline-none"
                          style={{
                            background: currentTheme.colors.surface,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        >
                          {dateFormats.map(format => (
                            <option key={format} value={format}>{format}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span 
                          className="text-sm font-medium"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Auto-save changes
                        </span>
                        <button
                          onClick={() => handleSettingChange('preferences', 'autoSave', !settings.preferences.autoSave)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.preferences.autoSave ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings.preferences.autoSave ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Privacy Settings */}
                  {activeSection === 'privacy' && (
                    <div className="space-y-4">
                      <h3 
                        className="font-semibold text-lg"
                        style={{ color: currentTheme.colors.text }}
                      >
                        Privacy Settings
                      </h3>
                      
                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Profile Visibility
                        </label>
                        <select
                          value={settings.privacy.profileVisibility}
                          onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                          className="w-full p-2 rounded-lg border focus:ring-2 focus:outline-none"
                          style={{
                            background: currentTheme.colors.surface,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        >
                          <option value="public">Public</option>
                          <option value="friends">Friends Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>

                      {['showEmail', 'showActivity', 'allowMessages'].map((setting) => (
                        <div key={setting} className="flex items-center justify-between">
                          <span 
                            className="text-sm font-medium"
                            style={{ color: currentTheme.colors.text }}
                          >
                            {setting === 'showEmail' ? 'Show email address' :
                             setting === 'showActivity' ? 'Show activity status' :
                             'Allow direct messages'}
                          </span>
                          <button
                            onClick={() => handleSettingChange('privacy', setting, !settings.privacy[setting as keyof typeof settings.privacy])}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.privacy[setting as keyof typeof settings.privacy] ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                settings.privacy[setting as keyof typeof settings.privacy] ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeSection === 'notifications' && (
                    <div className="space-y-4">
                      <h3 
                        className="font-semibold text-lg"
                        style={{ color: currentTheme.colors.text }}
                      >
                        Notification Preferences
                      </h3>
                      
                      {Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span 
                            className="text-sm font-medium"
                            style={{ color: currentTheme.colors.text }}
                          >
                            {key === 'email' ? 'Email notifications' :
                             key === 'push' ? 'Push notifications' :
                             key === 'marketing' ? 'Marketing emails' :
                             'Product updates'}
                          </span>
                          <button
                            onClick={() => handleSettingChange('notifications', key, !value)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              value ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                value ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Display Settings */}
                  {activeSection === 'display' && (
                    <div className="space-y-4">
                      <h3 
                        className="font-semibold text-lg"
                        style={{ color: currentTheme.colors.text }}
                      >
                        Display Settings
                      </h3>
                      
                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Font Size
                        </label>
                        <select
                          value={settings.display.fontSize}
                          onChange={(e) => handleSettingChange('display', 'fontSize', e.target.value)}
                          className="w-full p-2 rounded-lg border focus:ring-2 focus:outline-none"
                          style={{
                            background: currentTheme.colors.surface,
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                        </select>
                      </div>

                      {['animations', 'compactMode'].map((setting) => (
                        <div key={setting} className="flex items-center justify-between">
                          <span 
                            className="text-sm font-medium"
                            style={{ color: currentTheme.colors.text }}
                          >
                            {setting === 'animations' ? 'Enable animations' : 'Compact mode'}
                          </span>
                          <button
                            onClick={() => handleSettingChange('display', setting, !settings.display[setting as keyof typeof settings.display])}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              settings.display[setting as keyof typeof settings.display] ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                settings.display[setting as keyof typeof settings.display] ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Password Change Modal */}
            <AnimatePresence>
              {showPasswordChange && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm rounded-2xl p-6"
                    style={{
                      background: currentTheme.gradients.card,
                      border: `1px solid ${currentTheme.colors.border}`
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 
                        className="text-lg font-semibold"
                        style={{ color: currentTheme.colors.text }}
                      >
                        Change Password
                      </h3>
                      <button
                        onClick={() => setShowPasswordChange(false)}
                        className="p-1 rounded-lg transition-colors"
                        style={{ color: currentTheme.colors.textSecondary }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.current}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                            className="w-full p-2 pr-10 rounded-lg border focus:ring-2 focus:outline-none"
                            style={{
                              background: currentTheme.colors.surface,
                              borderColor: errors.current ? '#ef4444' : currentTheme.colors.border,
                              color: currentTheme.colors.text
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            style={{ color: currentTheme.colors.textSecondary }}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.current && (
                          <p className="text-sm text-red-500 mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.current}
                          </p>
                        )}
                      </div>

                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          New Password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.new}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                          className="w-full p-2 rounded-lg border focus:ring-2 focus:outline-none"
                          style={{
                            background: currentTheme.colors.surface,
                            borderColor: errors.new ? '#ef4444' : currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        />
                        {errors.new && (
                          <p className="text-sm text-red-500 mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.new}
                          </p>
                        )}
                      </div>

                      <div>
                        <label 
                          className="block text-sm font-medium mb-2"
                          style={{ color: currentTheme.colors.text }}
                        >
                          Confirm New Password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                          className="w-full p-2 rounded-lg border focus:ring-2 focus:outline-none"
                          style={{
                            background: currentTheme.colors.surface,
                            borderColor: errors.confirm ? '#ef4444' : currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        />
                        {errors.confirm && (
                          <p className="text-sm text-red-500 mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {errors.confirm}
                          </p>
                        )}
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <button
                          onClick={() => setShowPasswordChange(false)}
                          className="flex-1 py-2 px-4 rounded-lg border transition-colors"
                          style={{
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.text
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handlePasswordChange}
                          disabled={isSaving}
                          className="flex-1 py-2 px-4 rounded-lg text-white transition-all duration-300 disabled:opacity-50"
                          style={{ background: currentTheme.colors.primary }}
                        >
                          {isSaving ? 'Saving...' : 'Update'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save/Cancel Actions */}
            {(hasChanges || activeSection) && !showPasswordChange && (
              <div 
                className="p-4 border-t flex space-x-2"
                style={{ borderColor: currentTheme.colors.border }}
              >
                <button
                  onClick={() => {
                    setActiveSection(null);
                    setHasChanges(false);
                    // Reset settings to original values
                  }}
                  className="flex-1 py-2 px-4 rounded-lg border transition-colors"
                  style={{
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="flex-1 py-2 px-4 rounded-lg text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
                  style={{ background: currentTheme.colors.primary }}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}