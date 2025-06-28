import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Discovery from './pages/Discovery';
import Games from './pages/Games';
import Profile from './pages/Profile';
import Marketplace from './pages/Marketplace';
import AIChat from './components/AIChat';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ParticleBackground from './components/ParticleBackground';

function AppContent() {
  const [showAIChat, setShowAIChat] = useState(false);
  const { currentTheme } = useTheme();

  return (
    <div 
      className="min-h-screen relative overflow-hidden transition-all duration-500"
      style={{
        background: currentTheme.gradients.hero,
        color: currentTheme.colors.text
      }}
    >
      {/* Dynamic Background Image */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000"
        style={{
          backgroundImage: `var(--background-image)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 z-0 transition-all duration-1000"
        style={{
          background: currentTheme.backgroundOverlay
        }}
      />

      {/* Animated Particle Background */}
      <ParticleBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Navbar />
        
        <main className="relative z-10">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/games" element={<Games />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/marketplace" element={<Marketplace />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* AI Chat Toggle Button */}
        <motion.button
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
          style={{
            background: currentTheme.gradients.button,
            boxShadow: currentTheme.effects.glow
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAIChat(!showAIChat)}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <NotificationProvider>
          <Router>
            <AppContent />
          </Router>
        </NotificationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;