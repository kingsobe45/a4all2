import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  series: string;
  description: string;
  preview: string;
  backgroundImage: string;
  backgroundOverlay: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  gradients: {
    hero: string;
    card: string;
    button: string;
    accent: string;
    overlay: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  effects: {
    glow: string;
    shadow: string;
    blur: string;
    particle: string;
  };
}

const themes: Theme[] = [
  {
    id: 'simple',
    name: 'Simple & Clean',
    series: 'Original',
    description: 'Minimalist design with subtle gradients and clean aesthetics',
    preview: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: '',
    backgroundOverlay: 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%)',
    colors: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      accent: '#f37316',
      background: '#f8fafc',
      surface: 'rgba(255, 255, 255, 0.95)',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: 'rgba(226, 232, 240, 0.8)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      card: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
      button: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      accent: 'linear-gradient(135deg, #f37316 0%, #f59e0b 100%)',
      overlay: 'linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(6, 182, 212, 0.03) 100%)'
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 20px rgba(139, 92, 246, 0.15)',
      shadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      blur: 'backdrop-blur-xl',
      particle: 'rgba(139, 92, 246, 0.3)'
    }
  },
  {
    id: 'default',
    name: 'A4all Classic',
    series: 'Original',
    description: 'The original A4all experience with modern gradients and cosmic vibes',
    preview: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 50%, rgba(243, 115, 22, 0.15) 100%)',
    colors: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      accent: '#f37316',
      background: '#f8fafc',
      surface: 'rgba(255, 255, 255, 0.9)',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: 'rgba(139, 92, 246, 0.2)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      card: 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
      button: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      accent: 'linear-gradient(135deg, #f37316 0%, #f59e0b 100%)',
      overlay: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)'
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 30px rgba(139, 92, 246, 0.4)',
      shadow: '0 20px 40px rgba(139, 92, 246, 0.15)',
      blur: 'backdrop-blur-xl',
      particle: 'rgba(139, 92, 246, 0.6)'
    }
  },
  {
    id: 'got',
    name: 'Winter is Coming',
    series: 'Game of Thrones',
    description: 'Dark medieval realm with dragon fire gold, Stark steel, and Targaryen crimson',
    preview: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(26, 32, 44, 0.9) 30%, rgba(45, 55, 72, 0.9) 70%, rgba(74, 85, 104, 0.9) 100%)',
    colors: {
      primary: '#d4af37', // Dragon gold
      secondary: '#8b0000', // Targaryen crimson
      accent: '#4a5568', // Stark steel
      background: '#0a0a0a',
      surface: 'rgba(26, 32, 44, 0.95)',
      text: '#f7fafc',
      textSecondary: '#cbd5e0',
      border: 'rgba(212, 175, 55, 0.4)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0a0a0a 0%, #1a202c 30%, #2d3748 70%, #4a5568 100%)',
      card: 'linear-gradient(145deg, rgba(26, 32, 44, 0.98) 0%, rgba(15, 15, 15, 0.98) 100%)',
      button: 'linear-gradient(135deg, #d4af37 0%, #b8860b 50%, #8b6914 100%)',
      accent: 'linear-gradient(135deg, #8b0000 0%, #dc143c 50%, #ff6b6b 100%)',
      overlay: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(139, 0, 0, 0.12) 100%)'
    },
    fonts: {
      primary: 'Cinzel, serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 60px rgba(212, 175, 55, 0.8)',
      shadow: '0 30px 80px rgba(0, 0, 0, 0.9)',
      blur: 'backdrop-blur-lg',
      particle: 'rgba(212, 175, 55, 0.9)'
    }
  },
  {
    id: 'breaking-bad',
    name: 'Heisenberg',
    series: 'Breaking Bad',
    description: 'Desert meth lab with radioactive green, hazmat yellow, and copper chemistry',
    preview: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(26, 26, 26, 0.95) 30%, rgba(45, 55, 72, 0.95) 70%, rgba(139, 69, 19, 0.95) 100%)',
    colors: {
      primary: '#00ff41', // Radioactive green
      secondary: '#ffff00', // Hazmat yellow
      accent: '#ff4500', // Explosion orange
      background: '#050505',
      surface: 'rgba(20, 20, 20, 0.98)',
      text: '#f7fafc',
      textSecondary: '#a0aec0',
      border: 'rgba(0, 255, 65, 0.4)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #050505 0%, #141414 30%, #2d3748 70%, #8b4513 100%)',
      card: 'linear-gradient(145deg, rgba(20, 20, 20, 0.99) 0%, rgba(5, 5, 5, 0.99) 100%)',
      button: 'linear-gradient(135deg, #00ff41 0%, #00cc33 50%, #009926 100%)',
      accent: 'linear-gradient(135deg, #ffff00 0%, #ffd700 50%, #ffb347 100%)',
      overlay: 'linear-gradient(135deg, rgba(0, 255, 65, 0.08) 0%, rgba(255, 255, 0, 0.08) 100%)'
    },
    fonts: {
      primary: 'Roboto Mono, monospace',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 80px rgba(0, 255, 65, 1.0)',
      shadow: '0 25px 60px rgba(0, 255, 65, 0.4)',
      blur: 'backdrop-blur-md',
      particle: 'rgba(0, 255, 65, 1.0)'
    }
  },
  {
    id: 'witcher',
    name: 'Toss a Coin',
    series: 'The Witcher',
    description: 'Mystical Continent with violet magic, ancient amber, and monster blood',
    preview: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(20, 15, 30, 0.95) 0%, rgba(45, 36, 56, 0.95) 30%, rgba(85, 60, 154, 0.95) 70%, rgba(139, 69, 19, 0.95) 100%)',
    colors: {
      primary: '#9d4edd', // Violet magic
      secondary: '#ffa500', // Ancient amber
      accent: '#8b0000', // Monster blood
      background: '#140f1e',
      surface: 'rgba(32, 25, 40, 0.98)',
      text: '#f7fafc',
      textSecondary: '#c9a96e',
      border: 'rgba(157, 78, 221, 0.5)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #140f1e 0%, #201928 30%, #553c9a 70%, #8b4513 100%)',
      card: 'linear-gradient(145deg, rgba(32, 25, 40, 0.99) 0%, rgba(20, 15, 30, 0.99) 100%)',
      button: 'linear-gradient(135deg, #9d4edd 0%, #7209b7 50%, #5a189a 100%)',
      accent: 'linear-gradient(135deg, #ffa500 0%, #ff8c00 50%, #ff7f50 100%)',
      overlay: 'linear-gradient(135deg, rgba(157, 78, 221, 0.15) 0%, rgba(255, 165, 0, 0.15) 100%)'
    },
    fonts: {
      primary: 'Crimson Text, serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 100px rgba(157, 78, 221, 0.9)',
      shadow: '0 40px 100px rgba(20, 15, 30, 0.95)',
      blur: 'backdrop-blur-xl',
      particle: 'rgba(157, 78, 221, 0.9)'
    }
  },
  {
    id: 'stranger-things',
    name: 'Upside Down',
    series: 'Stranger Things',
    description: '80s retro nightmare with Demogorgon red, Mind Flayer purple, and neon chaos',
    preview: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(5, 5, 5, 0.95) 0%, rgba(20, 20, 40, 0.95) 30%, rgba(40, 20, 60, 0.95) 70%, rgba(80, 0, 80, 0.95) 100%)',
    colors: {
      primary: '#ff073a', // Demogorgon red
      secondary: '#8a2be2', // Mind Flayer purple
      accent: '#00ffff', // 80s cyan
      background: '#030303',
      surface: 'rgba(15, 15, 25, 0.98)',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: 'rgba(255, 7, 58, 0.6)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #030303 0%, #141428 30%, #28143c 70%, #500050 100%)',
      card: 'linear-gradient(145deg, rgba(15, 15, 25, 0.99) 0%, rgba(3, 3, 3, 0.99) 100%)',
      button: 'linear-gradient(135deg, #ff073a 0%, #e6002a 50%, #cc001f 100%)',
      accent: 'linear-gradient(135deg, #8a2be2 0%, #9932cc 50%, #ba55d3 100%)',
      overlay: 'linear-gradient(135deg, rgba(255, 7, 58, 0.12) 0%, rgba(138, 43, 226, 0.12) 100%)'
    },
    fonts: {
      primary: 'Orbitron, monospace',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 120px rgba(255, 7, 58, 1.0)',
      shadow: '0 30px 80px rgba(255, 7, 58, 0.6)',
      blur: 'backdrop-blur-sm',
      particle: 'rgba(255, 7, 58, 1.0)'
    }
  },
  {
    id: 'mandalorian',
    name: 'This is the Way',
    series: 'The Mandalorian',
    description: 'Galactic bounty hunter with beskar silver, hyperspace blue, and Tatooine bronze',
    preview: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(8, 12, 18, 0.95) 0%, rgba(15, 20, 25, 0.95) 30%, rgba(25, 35, 45, 0.95) 70%, rgba(139, 69, 19, 0.95) 100%)',
    colors: {
      primary: '#4a9eff', // Hyperspace blue
      secondary: '#c0c0c0', // Beskar silver
      accent: '#cd853f', // Tatooine bronze
      background: '#080c12',
      surface: 'rgba(15, 20, 25, 0.98)',
      text: '#f0f6fc',
      textSecondary: '#8b949e',
      border: 'rgba(74, 158, 255, 0.4)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #080c12 0%, #0f1419 30%, #19232d 70%, #8b4513 100%)',
      card: 'linear-gradient(145deg, rgba(15, 20, 25, 0.99) 0%, rgba(8, 12, 18, 0.99) 100%)',
      button: 'linear-gradient(135deg, #4a9eff 0%, #1e6bb8 50%, #0d47a1 100%)',
      accent: 'linear-gradient(135deg, #c0c0c0 0%, #a8a8a8 50%, #808080 100%)',
      overlay: 'linear-gradient(135deg, rgba(74, 158, 255, 0.08) 0%, rgba(192, 192, 192, 0.08) 100%)'
    },
    fonts: {
      primary: 'Exo 2, sans-serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 80px rgba(74, 158, 255, 0.8)',
      shadow: '0 35px 90px rgba(8, 12, 18, 0.95)',
      blur: 'backdrop-blur-lg',
      particle: 'rgba(74, 158, 255, 0.9)'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Night City',
    series: 'Cyberpunk 2077',
    description: 'Neon-soaked dystopia with electric cyan, hot magenta, and toxic yellow',
    preview: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 0, 40, 0.9) 30%, rgba(40, 0, 80, 0.9) 70%, rgba(80, 0, 160, 0.9) 100%)',
    colors: {
      primary: '#00ffff', // Electric cyan
      secondary: '#ff00ff', // Hot magenta
      accent: '#ffff00', // Toxic yellow
      background: '#000000',
      surface: 'rgba(10, 0, 20, 0.98)',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: 'rgba(0, 255, 255, 0.6)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #000000 0%, #140028 30%, #280050 70%, #5000a0 100%)',
      card: 'linear-gradient(145deg, rgba(10, 0, 20, 0.99) 0%, rgba(0, 0, 0, 0.99) 100%)',
      button: 'linear-gradient(135deg, #00ffff 0%, #0080ff 50%, #0040ff 100%)',
      accent: 'linear-gradient(135deg, #ff00ff 0%, #ff0080 50%, #ff0040 100%)',
      overlay: 'linear-gradient(135deg, rgba(0, 255, 255, 0.15) 0%, rgba(255, 0, 255, 0.15) 100%)'
    },
    fonts: {
      primary: 'Orbitron, monospace',
      secondary: 'Roboto Mono, monospace'
    },
    effects: {
      glow: '0 0 150px rgba(0, 255, 255, 1.0)',
      shadow: '0 40px 120px rgba(255, 0, 255, 0.8)',
      blur: 'backdrop-blur-sm',
      particle: 'rgba(0, 255, 255, 1.0)'
    }
  },
  {
    id: 'vikings',
    name: 'Valhalla Awaits',
    series: 'Vikings',
    description: 'Nordic saga with blood crimson, ice blue, and ancient bronze runes',
    preview: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(30, 30, 40, 0.95) 30%, rgba(50, 70, 90, 0.95) 70%, rgba(139, 69, 19, 0.95) 100%)',
    colors: {
      primary: '#8b0000', // Blood crimson
      secondary: '#4682b4', // Ice blue
      accent: '#cd853f', // Ancient bronze
      background: '#0f0f0f',
      surface: 'rgba(25, 25, 30, 0.98)',
      text: '#f5f5f5',
      textSecondary: '#c0c0c0',
      border: 'rgba(139, 0, 0, 0.5)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0f0f0f 0%, #1e1e28 30%, #32465a 70%, #8b4513 100%)',
      card: 'linear-gradient(145deg, rgba(25, 25, 30, 0.99) 0%, rgba(15, 15, 15, 0.99) 100%)',
      button: 'linear-gradient(135deg, #8b0000 0%, #660000 50%, #4d0000 100%)',
      accent: 'linear-gradient(135deg, #4682b4 0%, #2e5984 50%, #1e3a5f 100%)',
      overlay: 'linear-gradient(135deg, rgba(139, 0, 0, 0.12) 0%, rgba(70, 130, 180, 0.12) 100%)'
    },
    fonts: {
      primary: 'Cinzel, serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 100px rgba(139, 0, 0, 0.9)',
      shadow: '0 50px 120px rgba(15, 15, 15, 0.95)',
      blur: 'backdrop-blur-lg',
      particle: 'rgba(139, 0, 0, 0.9)'
    }
  },
  {
    id: 'matrix',
    name: 'Digital Rain',
    series: 'The Matrix',
    description: 'Code reality with matrix green, void black, and digital phosphor',
    preview: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(0, 10, 0, 0.98) 30%, rgba(0, 20, 0, 0.98) 70%, rgba(0, 40, 0, 0.98) 100%)',
    colors: {
      primary: '#00ff00', // Matrix green
      secondary: '#39ff14', // Phosphor green
      accent: '#ffffff', // Digital white
      background: '#000000',
      surface: 'rgba(0, 5, 0, 0.99)',
      text: '#00ff00',
      textSecondary: '#008000',
      border: 'rgba(0, 255, 0, 0.6)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #000000 0%, #000a00 30%, #001400 70%, #002800 100%)',
      card: 'linear-gradient(145deg, rgba(0, 5, 0, 0.99) 0%, rgba(0, 0, 0, 0.99) 100%)',
      button: 'linear-gradient(135deg, #00ff00 0%, #00cc00 50%, #009900 100%)',
      accent: 'linear-gradient(135deg, #39ff14 0%, #32cd32 50%, #228b22 100%)',
      overlay: 'linear-gradient(135deg, rgba(0, 255, 0, 0.08) 0%, rgba(57, 255, 20, 0.08) 100%)'
    },
    fonts: {
      primary: 'Roboto Mono, monospace',
      secondary: 'Courier New, monospace'
    },
    effects: {
      glow: '0 0 100px rgba(0, 255, 0, 1.0)',
      shadow: '0 20px 60px rgba(0, 255, 0, 0.5)',
      blur: 'backdrop-blur-none',
      particle: 'rgba(0, 255, 0, 1.0)'
    }
  },
  {
    id: 'avatar',
    name: 'Pandora',
    series: 'Avatar',
    description: 'Bioluminescent world with Na\'vi blue, sacred tree purple, and unobtainium glow',
    preview: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(0, 20, 40, 0.95) 0%, rgba(0, 40, 80, 0.95) 30%, rgba(20, 60, 120, 0.95) 70%, rgba(40, 80, 160, 0.95) 100%)',
    colors: {
      primary: '#00bfff', // Na'vi blue
      secondary: '#9370db', // Sacred tree purple
      accent: '#00ffff', // Unobtainium glow
      background: '#001428',
      surface: 'rgba(0, 30, 60, 0.98)',
      text: '#e0f6ff',
      textSecondary: '#87ceeb',
      border: 'rgba(0, 191, 255, 0.4)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #001428 0%, #002850 30%, #143c78 70%, #2850a0 100%)',
      card: 'linear-gradient(145deg, rgba(0, 30, 60, 0.99) 0%, rgba(0, 20, 40, 0.99) 100%)',
      button: 'linear-gradient(135deg, #00bfff 0%, #0080ff 50%, #0040ff 100%)',
      accent: 'linear-gradient(135deg, #9370db 0%, #8a2be2 50%, #7b68ee 100%)',
      overlay: 'linear-gradient(135deg, rgba(0, 191, 255, 0.12) 0%, rgba(147, 112, 219, 0.12) 100%)'
    },
    fonts: {
      primary: 'Exo 2, sans-serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 120px rgba(0, 191, 255, 0.9)',
      shadow: '0 40px 100px rgba(0, 20, 40, 0.95)',
      blur: 'backdrop-blur-xl',
      particle: 'rgba(0, 191, 255, 0.9)'
    }
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  themes: Theme[];
  isDark: boolean;
  setTheme: (themeId: string) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState('simple');
  const [isDark, setIsDark] = useState(false);

  const currentTheme = themes.find(theme => theme.id === currentThemeId) || themes[0];

  useEffect(() => {
    const stored = localStorage.getItem('a4all-theme');
    const storedDark = localStorage.getItem('a4all-dark-mode');
    
    if (stored && themes.find(t => t.id === stored)) {
      setCurrentThemeId(stored);
    }
    
    if (storedDark) {
      setIsDark(storedDark === 'true');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme CSS variables
    const root = document.documentElement;
    const theme = currentTheme;
    
    // Set CSS custom properties
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    
    root.style.setProperty('--gradient-hero', theme.gradients.hero);
    root.style.setProperty('--gradient-card', theme.gradients.card);
    root.style.setProperty('--gradient-button', theme.gradients.button);
    root.style.setProperty('--gradient-accent', theme.gradients.accent);
    root.style.setProperty('--gradient-overlay', theme.gradients.overlay);
    
    root.style.setProperty('--font-primary', theme.fonts.primary);
    root.style.setProperty('--font-secondary', theme.fonts.secondary);
    
    root.style.setProperty('--effect-glow', theme.effects.glow);
    root.style.setProperty('--effect-shadow', theme.effects.shadow);
    root.style.setProperty('--effect-blur', theme.effects.blur);
    root.style.setProperty('--effect-particle', theme.effects.particle);

    // Set background image and overlay
    root.style.setProperty('--background-image', theme.backgroundImage ? `url(${theme.backgroundImage})` : 'none');
    root.style.setProperty('--background-overlay', theme.backgroundOverlay);

    // Handle dark mode
    if (isDark || (theme.id !== 'default' && theme.id !== 'simple')) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load Google Fonts dynamically
    const fontLink = document.getElementById('theme-fonts') as HTMLLinkElement;
    if (fontLink) {
      fontLink.remove();
    }

    const newFontLink = document.createElement('link');
    newFontLink.id = 'theme-fonts';
    newFontLink.rel = 'stylesheet';
    
    const fontFamilies = [
      theme.fonts.primary.split(',')[0].replace(/['"]/g, ''),
      theme.fonts.secondary.split(',')[0].replace(/['"]/g, '')
    ].filter(font => font !== 'Inter' && font !== 'sans-serif' && font !== 'serif' && font !== 'monospace');
    
    if (fontFamilies.length > 0) {
      newFontLink.href = `https://fonts.googleapis.com/css2?${fontFamilies.map(font => 
        `family=${font.replace(/ /g, '+')}:wght@300;400;500;600;700`
      ).join('&')}&display=swap`;
      document.head.appendChild(newFontLink);
    }

    localStorage.setItem('a4all-theme', currentThemeId);
    localStorage.setItem('a4all-dark-mode', isDark.toString());
  }, [currentTheme, currentThemeId, isDark]);

  const setTheme = (themeId: string) => {
    setCurrentThemeId(themeId);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themes,
      isDark,
      setTheme,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}