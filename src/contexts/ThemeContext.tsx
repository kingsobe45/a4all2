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
    id: 'default',
    name: 'A4all Classic',
    series: 'Original',
    description: 'The original A4all experience with modern gradients',
    preview: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
    colors: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      accent: '#f37316',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      card: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
      button: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      accent: 'linear-gradient(135deg, #f37316 0%, #f59e0b 100%)',
      overlay: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)'
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 20px rgba(139, 92, 246, 0.3)',
      shadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      blur: 'backdrop-blur-xl',
      particle: 'rgba(139, 92, 246, 0.4)'
    }
  },
  {
    id: 'got',
    name: 'Winter is Coming',
    series: 'Game of Thrones',
    description: 'Dark, medieval theme inspired by the Iron Throne and Winterfell',
    preview: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(26, 26, 26, 0.85) 0%, rgba(45, 55, 72, 0.85) 50%, rgba(74, 85, 104, 0.85) 100%)',
    colors: {
      primary: '#d4af37', // Royal gold
      secondary: '#8b0000', // Deep red (Targaryen)
      accent: '#4682b4', // Steel blue (Stark)
      background: '#0f0f0f',
      surface: 'rgba(45, 55, 72, 0.9)',
      text: '#f7fafc',
      textSecondary: '#cbd5e0',
      border: 'rgba(212, 175, 55, 0.3)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0f0f0f 0%, #2d3748 50%, #4a5568 100%)',
      card: 'linear-gradient(145deg, rgba(45, 55, 72, 0.95) 0%, rgba(26, 32, 44, 0.95) 100%)',
      button: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
      accent: 'linear-gradient(135deg, #8b0000 0%, #dc143c 100%)',
      overlay: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(139, 0, 0, 0.1) 100%)'
    },
    fonts: {
      primary: 'Cinzel, serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 40px rgba(212, 175, 55, 0.6)',
      shadow: '0 20px 50px rgba(0, 0, 0, 0.8)',
      blur: 'backdrop-blur-md',
      particle: 'rgba(212, 175, 55, 0.7)'
    }
  },
  {
    id: 'breaking-bad',
    name: 'Heisenberg',
    series: 'Breaking Bad',
    description: 'Gritty desert chemistry lab with neon green and hazmat yellow',
    preview: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(26, 26, 26, 0.9) 50%, rgba(45, 55, 72, 0.9) 100%)',
    colors: {
      primary: '#00ff41', // Neon green (chemistry)
      secondary: '#ffff00', // Hazmat yellow
      accent: '#ff4500', // Orange (explosion)
      background: '#0a0a0a',
      surface: 'rgba(26, 26, 26, 0.95)',
      text: '#f7fafc',
      textSecondary: '#a0aec0',
      border: 'rgba(0, 255, 65, 0.3)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d3748 100%)',
      card: 'linear-gradient(145deg, rgba(26, 26, 26, 0.98) 0%, rgba(15, 15, 15, 0.98) 100%)',
      button: 'linear-gradient(135deg, #00ff41 0%, #00cc33 100%)',
      accent: 'linear-gradient(135deg, #ffff00 0%, #ffd700 100%)',
      overlay: 'linear-gradient(135deg, rgba(0, 255, 65, 0.05) 0%, rgba(255, 255, 0, 0.05) 100%)'
    },
    fonts: {
      primary: 'Roboto Mono, monospace',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 50px rgba(0, 255, 65, 0.8)',
      shadow: '0 15px 40px rgba(0, 255, 65, 0.3)',
      blur: 'backdrop-blur-lg',
      particle: 'rgba(0, 255, 65, 0.9)'
    }
  },
  {
    id: 'witcher',
    name: 'Toss a Coin',
    series: 'The Witcher',
    description: 'Mystical Continent with violet magic and ancient gold',
    preview: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(26, 22, 37, 0.9) 0%, rgba(45, 36, 56, 0.9) 50%, rgba(85, 60, 154, 0.9) 100%)',
    colors: {
      primary: '#9d4edd', // Violet magic
      secondary: '#ffd60a', // Ancient gold
      accent: '#e63946', // Blood red (monsters)
      background: '#1a1625',
      surface: 'rgba(45, 36, 56, 0.95)',
      text: '#f7fafc',
      textSecondary: '#c9a96e',
      border: 'rgba(157, 78, 221, 0.4)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #1a1625 0%, #2d2438 50%, #553c9a 100%)',
      card: 'linear-gradient(145deg, rgba(45, 36, 56, 0.98) 0%, rgba(26, 22, 37, 0.98) 100%)',
      button: 'linear-gradient(135deg, #9d4edd 0%, #7209b7 100%)',
      accent: 'linear-gradient(135deg, #ffd60a 0%, #e9c46a 100%)',
      overlay: 'linear-gradient(135deg, rgba(157, 78, 221, 0.1) 0%, rgba(255, 214, 10, 0.1) 100%)'
    },
    fonts: {
      primary: 'Crimson Text, serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 60px rgba(157, 78, 221, 0.8)',
      shadow: '0 25px 60px rgba(26, 22, 37, 0.9)',
      blur: 'backdrop-blur-xl',
      particle: 'rgba(157, 78, 221, 0.8)'
    }
  },
  {
    id: 'stranger-things',
    name: 'Upside Down',
    series: 'Stranger Things',
    description: '80s retro neon with Hawkins lab and Demogorgon vibes',
    preview: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(26, 26, 46, 0.9) 50%, rgba(22, 33, 62, 0.9) 100%)',
    colors: {
      primary: '#ff073a', // Neon red (Upside Down)
      secondary: '#39ff14', // Electric green (80s neon)
      accent: '#ff6ec7', // Hot pink (80s aesthetic)
      background: '#0a0a0a',
      surface: 'rgba(26, 26, 46, 0.95)',
      text: '#f7fafc',
      textSecondary: '#a0aec0',
      border: 'rgba(255, 7, 58, 0.4)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      card: 'linear-gradient(145deg, rgba(26, 26, 46, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)',
      button: 'linear-gradient(135deg, #ff073a 0%, #c70025 100%)',
      accent: 'linear-gradient(135deg, #39ff14 0%, #2bcc0f 100%)',
      overlay: 'linear-gradient(135deg, rgba(255, 7, 58, 0.08) 0%, rgba(57, 255, 20, 0.08) 100%)'
    },
    fonts: {
      primary: 'Orbitron, monospace',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 80px rgba(255, 7, 58, 0.9)',
      shadow: '0 20px 50px rgba(255, 7, 58, 0.4)',
      blur: 'backdrop-blur-lg',
      particle: 'rgba(255, 7, 58, 0.9)'
    }
  },
  {
    id: 'mandalorian',
    name: 'This is the Way',
    series: 'The Mandalorian',
    description: 'Beskar steel space odyssey with galactic blue and Tatooine sand',
    preview: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(13, 17, 23, 0.9) 0%, rgba(22, 27, 34, 0.9) 50%, rgba(33, 38, 45, 0.9) 100%)',
    colors: {
      primary: '#4a9eff', // Hyperspace blue
      secondary: '#c9b037', // Beskar gold
      accent: '#ff6b35', // Tatooine sunset
      background: '#0d1117',
      surface: 'rgba(22, 27, 34, 0.95)',
      text: '#f0f6fc',
      textSecondary: '#8b949e',
      border: 'rgba(74, 158, 255, 0.3)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
      card: 'linear-gradient(145deg, rgba(22, 27, 34, 0.98) 0%, rgba(13, 17, 23, 0.98) 100%)',
      button: 'linear-gradient(135deg, #4a9eff 0%, #1e6bb8 100%)',
      accent: 'linear-gradient(135deg, #c9b037 0%, #b8860b 100%)',
      overlay: 'linear-gradient(135deg, rgba(74, 158, 255, 0.05) 0%, rgba(201, 176, 55, 0.05) 100%)'
    },
    fonts: {
      primary: 'Exo 2, sans-serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 50px rgba(74, 158, 255, 0.7)',
      shadow: '0 25px 60px rgba(13, 17, 23, 0.9)',
      blur: 'backdrop-blur-md',
      particle: 'rgba(74, 158, 255, 0.8)'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Night City',
    series: 'Cyberpunk 2077',
    description: 'Neon-soaked dystopian future with electric cyan and hot magenta',
    preview: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(20, 0, 40, 0.85) 50%, rgba(40, 0, 80, 0.85) 100%)',
    colors: {
      primary: '#00ffff', // Electric cyan
      secondary: '#ff00ff', // Hot magenta
      accent: '#ffff00', // Neon yellow
      background: '#000000',
      surface: 'rgba(20, 0, 40, 0.95)',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: 'rgba(0, 255, 255, 0.5)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #000000 0%, #140028 50%, #280050 100%)',
      card: 'linear-gradient(145deg, rgba(20, 0, 40, 0.98) 0%, rgba(0, 0, 0, 0.98) 100%)',
      button: 'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)',
      accent: 'linear-gradient(135deg, #ff00ff 0%, #ff0080 100%)',
      overlay: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 255, 0.1) 100%)'
    },
    fonts: {
      primary: 'Orbitron, monospace',
      secondary: 'Roboto Mono, monospace'
    },
    effects: {
      glow: '0 0 100px rgba(0, 255, 255, 1.0)',
      shadow: '0 30px 80px rgba(255, 0, 255, 0.5)',
      blur: 'backdrop-blur-sm',
      particle: 'rgba(0, 255, 255, 1.0)'
    }
  },
  {
    id: 'vikings',
    name: 'Valhalla Awaits',
    series: 'Vikings',
    description: 'Nordic saga with blood red, ice blue, and ancient runes',
    preview: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=300',
    backgroundImage: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=1920',
    backgroundOverlay: 'linear-gradient(135deg, rgba(25, 25, 25, 0.9) 0%, rgba(45, 45, 60, 0.9) 50%, rgba(60, 80, 100, 0.9) 100%)',
    colors: {
      primary: '#8b0000', // Blood red
      secondary: '#4682b4', // Ice blue
      accent: '#daa520', // Ancient gold
      background: '#191919',
      surface: 'rgba(45, 45, 60, 0.95)',
      text: '#f5f5f5',
      textSecondary: '#c0c0c0',
      border: 'rgba(139, 0, 0, 0.4)'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #191919 0%, #2d2d3c 50%, #3c5064 100%)',
      card: 'linear-gradient(145deg, rgba(45, 45, 60, 0.98) 0%, rgba(25, 25, 25, 0.98) 100%)',
      button: 'linear-gradient(135deg, #8b0000 0%, #660000 100%)',
      accent: 'linear-gradient(135deg, #4682b4 0%, #2e5984 100%)',
      overlay: 'linear-gradient(135deg, rgba(139, 0, 0, 0.1) 0%, rgba(70, 130, 180, 0.1) 100%)'
    },
    fonts: {
      primary: 'Cinzel, serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 60px rgba(139, 0, 0, 0.8)',
      shadow: '0 30px 70px rgba(25, 25, 25, 0.9)',
      blur: 'backdrop-blur-md',
      particle: 'rgba(139, 0, 0, 0.8)'
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
  const [currentThemeId, setCurrentThemeId] = useState('default');
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

    // Set background image
    root.style.setProperty('--background-image', `url(${theme.backgroundImage})`);
    root.style.setProperty('--background-overlay', theme.backgroundOverlay);

    // Handle dark mode
    if (isDark || theme.id !== 'default') {
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