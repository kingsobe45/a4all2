import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Discovery from './pages/Discovery';
import Games from './pages/Games';
import Profile from './pages/Profile';
import AIChat from './components/AIChat';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ParticleBackground from './components/ParticleBackground';

function App() {
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-cyan-900/20 transition-colors duration-300">
              <ParticleBackground />
              <Navbar />
              
              <main className="relative z-10">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/discovery" element={<Discovery />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </AnimatePresence>
              </main>

              {/* AI Chat Toggle Button */}
              <motion.button
                className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAIChat(!showAIChat)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </motion.button>

              {/* AI Chat Modal */}
              <AnimatePresence>
                {showAIChat && (
                  <AIChat onClose={() => setShowAIChat(false)} />
                )}
              </AnimatePresence>
            </div>
          </Router>
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;