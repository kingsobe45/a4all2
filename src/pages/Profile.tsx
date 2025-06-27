import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit, Trophy, Star, Users, Calendar, Target, Zap, BookOpen, MessageSquare } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const achievements = [
  { id: 1, name: 'First Steps', description: 'Completed your first challenge', icon: '🏆', earned: true, date: '2024-01-15' },
  { id: 2, name: 'AI Whisperer', description: 'Had 100 conversations with A4AI', icon: '🤖', earned: true, date: '2024-01-20' },
  { id: 3, name: 'Content Creator', description: 'Shared 50 pieces of content', icon: '📝', earned: true, date: '2024-01-25' },
  { id: 4, name: 'Game Master', description: 'Won 25 games in a row', icon: '🎮', earned: false, progress: 18 },
  { id: 5, name: 'Trend Setter', description: 'Posted content that went viral', icon: '🔥', earned: false, progress: 65 },
  { id: 6, name: 'Community Leader', description: 'Gained 1000 followers', icon: '👥', earned: false, progress: 124 }
];

const recentActivity = [
  { id: 1, type: 'game', action: 'Completed Quantum Chess challenge', xp: 45, time: '2 hours ago' },
  { id: 2, type: 'discovery', action: 'Discovered trending AI article', xp: 15, time: '4 hours ago' },
  { id: 3, type: 'social', action: 'Started discussion on Web3', xp: 25, time: '6 hours ago' },
  { id: 4, type: 'achievement', action: 'Unlocked "AI Whisperer" badge', xp: 100, time: '1 day ago' },
  { id: 5, type: 'game', action: 'Set new high score in Neural Builder', xp: 35, time: '2 days ago' }
];

const stats = [
  { label: 'Games Played', value: '347', icon: Target, color: 'text-primary-500' },
  { label: 'Articles Read', value: '1.2K', icon: BookOpen, color: 'text-secondary-500' },
  { label: 'Discussions', value: '89', icon: MessageSquare, color: 'text-accent-500' },
  { label: 'AI Interactions', value: '2.5K', icon: Zap, color: 'text-purple-500' }
];

export default function Profile() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Please log in to view your profile
          </h2>
          <button className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl">
            Log In
          </button>
        </div>
      </div>
    );
  }

  const xpToNextLevel = (user.level * 200) - user.xp;
  const levelProgress = ((user.xp % 200) / 200) * 100;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-8 mb-8 shadow-xl border border-slate-200 dark:border-slate-700"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-700"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {user.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                  {user.username}
                </h1>
                <button className="p-2 text-slate-400 hover:text-primary-500 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Level {user.level} • {user.xp.toLocaleString()} XP
              </p>

              {/* XP Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <span>Progress to Level {user.level + 1}</span>
                  <span>{xpToNextLevel} XP to go</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Social Stats */}
              <div className="flex justify-center md:justify-start space-x-6 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {user.followers.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                    {user.following.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Following</div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {user.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1 bg-gradient-to-r from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <button className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-lg border border-slate-200 dark:border-slate-700"
              >
                <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {['overview', 'achievements', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'game' ? 'bg-primary-500' :
                        activity.type === 'discovery' ? 'bg-secondary-500' :
                        activity.type === 'social' ? 'bg-accent-500' :
                        'bg-purple-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-sm text-slate-800 dark:text-slate-200">
                          {activity.action}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          +{activity.xp} XP • {activity.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Achievements */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
                  Recent Achievements
                </h3>
                <div className="space-y-4">
                  {achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {achievement.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
                Achievements & Badges
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border-2 ${
                      achievement.earned
                        ? 'border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                    }`}
                  >
                    <div className="text-center mb-3">
                      <div className={`text-4xl mb-2 ${achievement.earned ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <h4 className={`font-semibold ${
                        achievement.earned
                          ? 'text-primary-700 dark:text-primary-300'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {achievement.name}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-3">
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <div className="text-xs text-primary-600 dark:text-primary-400 text-center">
                        Earned {achievement.date}
                      </div>
                    ) : (
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6">
                Activity Timeline
              </h3>
              <div className="space-y-6">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      activity.type === 'game' ? 'bg-primary-500' :
                      activity.type === 'discovery' ? 'bg-secondary-500' :
                      activity.type === 'social' ? 'bg-accent-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div className="flex-1 pb-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {activity.action}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {activity.time}
                        </div>
                      </div>
                      <div className="text-sm text-primary-600 dark:text-primary-400">
                        +{activity.xp} XP earned
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}