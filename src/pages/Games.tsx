import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Users, Star, Clock, Zap, Target, Brain } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const gameCategories = ['All', 'Strategy', 'Puzzle', 'Trivia', 'Action', 'AI Challenges'];

const featuredGames = [
  {
    id: 1,
    title: 'Quantum Chess',
    category: 'Strategy',
    description: 'A mind-bending chess variant where pieces exist in quantum superposition',
    thumbnail: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
    players: '24.5K',
    rating: 4.8,
    difficulty: 'Expert',
    playTime: '15-30 min',
    aiPowered: true,
    featured: true
  },
  {
    id: 2,
    title: 'Neural Network Builder',
    category: 'Puzzle',
    description: 'Build and train neural networks to solve increasingly complex problems',
    thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400',
    players: '18.2K',
    rating: 4.6,
    difficulty: 'Intermediate',
    playTime: '10-20 min',
    aiPowered: true,
    featured: true
  },
  {
    id: 3,
    title: 'Code Wars Arena',
    category: 'Strategy',
    description: 'Real-time coding battles with AI-generated challenges',
    thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=400',
    players: '31.7K',
    rating: 4.9,
    difficulty: 'Advanced',
    playTime: '5-15 min',
    aiPowered: true,
    featured: false
  },
  {
    id: 4,
    title: 'Trivia Master AI',
    category: 'Trivia',
    description: 'Challenge an AI that generates questions based on your interests',
    thumbnail: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=400',
    players: '42.1K',
    rating: 4.7,
    difficulty: 'Beginner',
    playTime: '5-10 min',
    aiPowered: true,
    featured: false
  },
  {
    id: 5,
    title: 'Pattern Recognition Challenge',
    category: 'Puzzle',
    description: 'Train your pattern recognition skills with AI-generated sequences',
    thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    players: '15.8K',
    rating: 4.4,
    difficulty: 'Intermediate',
    playTime: '3-8 min',
    aiPowered: true,
    featured: false
  },
  {
    id: 6,
    title: 'Logic Puzzle Generator',
    category: 'Puzzle',
    description: 'Infinite logic puzzles generated by advanced AI algorithms',
    thumbnail: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
    players: '9.3K',
    rating: 4.5,
    difficulty: 'Beginner',
    playTime: '5-12 min',
    aiPowered: true,
    featured: false
  }
];

const leaderboards = [
  { rank: 1, username: 'QuantumMaster', score: 15420, badge: '👑' },
  { rank: 2, username: 'NeuralNinja', score: 14890, badge: '🥈' },
  { rank: 3, username: 'CodeCrusher', score: 14205, badge: '🥉' },
  { rank: 4, username: 'PuzzlePro', score: 13750, badge: '⭐' },
  { rank: 5, username: 'AIChallenger', score: 13120, badge: '💎' }
];

export default function Games() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const { user, updateXP } = useUser();

  const filteredGames = selectedCategory === 'All' 
    ? featuredGames 
    : featuredGames.filter(game => game.category === selectedCategory);

  const handlePlayGame = (gameId: number) => {
    // Simulate playing a game and earning XP
    updateXP(Math.floor(Math.random() * 50) + 10);
    // In a real implementation, this would navigate to the game or open a game modal
    alert('Game starting! (This would open the actual game)');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Games Hub
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Challenge your mind with AI-powered games and compete with players worldwide
          </p>

          {/* User Stats */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  Level {user.level}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Current Level</div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                  {user.xp.toLocaleString()}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Total XP</div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-700"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
                  {user.badges.length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Badges Earned</div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Category Filter & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
        >
          <div className="flex flex-wrap gap-2">
            {gameCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>
        </motion.div>

        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowLeaderboard(false)}
          >
            <div
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Global Leaderboard
              </h3>
              <div className="space-y-3">
                {leaderboards.map((player) => (
                  <div
                    key={player.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      player.rank <= 3
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20'
                        : 'bg-slate-50 dark:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{player.badge}</span>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {player.username}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          Rank #{player.rank}
                        </div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {player.score.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="w-full mt-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {/* Featured Games */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
            >
              <div className="relative">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                />
                {game.featured && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-accent-500 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                )}
                {game.aiPowered && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Brain className="w-3 h-3" />
                    <span>AI</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-sm">
                  {game.playTime}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    {game.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    game.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    game.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    game.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
                  {game.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {game.players}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {game.rating}
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-sm">
                    {game.category}
                  </span>
                </div>

                <button
                  onClick={() => handlePlayGame(game.id)}
                  className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Play Now</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-2xl p-6 text-center">
            <Target className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Daily Challenge</h3>
            <p className="text-primary-100 mb-4">Complete today's AI-generated challenge</p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
              Start Challenge
            </button>
          </div>

          <div className="bg-gradient-to-br from-secondary-500 to-cyan-600 text-white rounded-2xl p-6 text-center">
            <Zap className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Quick Match</h3>
            <p className="text-secondary-100 mb-4">Find opponents for instant gameplay</p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
              Find Match
            </button>
          </div>

          <div className="bg-gradient-to-br from-accent-500 to-orange-600 text-white rounded-2xl p-6 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Training</h3>
            <p className="text-accent-100 mb-4">Improve your skills with AI coaching</p>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
              Start Training
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}