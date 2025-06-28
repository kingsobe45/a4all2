import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Theme {
  id: string;
  name: string;
  series: string;
  description: string;
  preview: string;
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
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  effects: {
    glow: string;
    shadow: string;
    blur: string;
  };
}

const themes: Theme[] = [
  {
    id: 'default',
    name: 'A4all Classic',
    series: 'Original',
    description: 'The original A4all experience with modern gradients',
    preview: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=300',
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
      card: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      button: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      accent: 'linear-gradient(135deg, #f37316 0%, #f59e0b 100%)'
    },
    fonts: {
      primary: 'Inter, sans-serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 20px rgba(139, 92, 246, 0.3)',
      shadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      blur: 'backdrop-blur-xl'
    }
  },
  {
    id: 'got',
    name: 'Winter is Coming',
    series: 'Game of Thrones',
    description: 'Dark, medieval theme inspired by the Seven Kingdoms',
    preview: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=300',
    colors: {
      primary: '#c9a96e',
      secondary: '#4a5568',
      accent: '#e53e3e',
      background: '#1a1a1a',
      surface: '#2d3748',
      text: '#f7fafc',
      textSecondary: '#a0aec0',
      border: '#4a5568'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #1a1a1a 0%, #2d3748 50%, #4a5568 100%)',
      card: 'linear-gradient(145deg, #2d3748 0%, #1a202c 100%)',
      button: 'linear-gradient(135deg, #c9a96e 0%, #b7791f 100%)',
      accent: 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)'
    },
    fonts: {
      primary: 'Cinzel, serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 30px rgba(201, 169, 110, 0.4)',
      shadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
      blur: 'backdrop-blur-md'
    }
  },
  {
    id: 'breaking-bad',
    name: 'Heisenberg',
    series: 'Breaking Bad',
    description: 'Green and yellow chemistry-inspired theme',
    preview: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=300',
    colors: {
      primary: '#38a169',
      secondary: '#ecc94b',
      accent: '#e53e3e',
      background: '#0f0f0f',
      surface: '#1a1a1a',
      text: '#f7fafc',
      textSecondary: '#a0aec0',
      border: '#2d3748'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2d3748 100%)',
      card: 'linear-gradient(145deg, #1a1a1a 0%, #0f0f0f 100%)',
      button: 'linear-gradient(135deg, #38a169 0%, #2f855a 100%)',
      accent: 'linear-gradient(135deg, #ecc94b 0%, #d69e2e 100%)'
    },
    fonts: {
      primary: 'Roboto Mono, monospace',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 25px rgba(56, 161, 105, 0.4)',
      shadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
      blur: 'backdrop-blur-lg'
    }
  },
  {
    id: 'witcher',
    name: 'Toss a Coin',
    series: 'The Witcher',
    description: 'Mystical purple and gold theme from the Continent',
    preview: 'https://images.pexels.com/photos/1670977/pexels-photo-1670977.jpeg?auto=compress&cs=tinysrgb&w=300',
    colors: {
      primary: '#805ad5',
      secondary: '#d69e2e',
      accent: '#e53e3e',
      background: '#1a1625',
      surface: '#2d2438',
      text: '#f7fafc',
      textSecondary: '#a0aec0',
      border: '#553c9a'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #1a1625 0%, #2d2438 50%, #553c9a 100%)',
      card: 'linear-gradient(145deg, #2d2438 0%, #1a1625 100%)',
      button: 'linear-gradient(135deg, #805ad5 0%, #553c9a 100%)',
      accent: 'linear-gradient(135deg, #d69e2e 0%, #b7791f 100%)'
    },
    fonts: {
      primary: 'Crimson Text, serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 35px rgba(128, 90, 213, 0.5)',
      shadow: '0 20px 40px rgba(26, 22, 37, 0.6)',
      blur: 'backdrop-blur-xl'
    }
  },
  {
    id: 'stranger-things',
    name: 'Upside Down',
    series: 'Stranger Things',
    description: '80s retro neon theme from Hawkins',
    preview: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=300',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      accent: '#ffe66d',
      background: '#0a0a0a',
      surface: '#1a1a2e',
      text: '#f7fafc',
      textSecondary: '#a0aec0',
      border: '#16213e'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      card: 'linear-gradient(145deg, #1a1a2e 0%, #0a0a0a 100%)',
      button: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
      accent: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)'
    },
    fonts: {
      primary: 'Orbitron, monospace',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 40px rgba(255, 107, 107, 0.6)',
      shadow: '0 15px 35px rgba(255, 107, 107, 0.2)',
      blur: 'backdrop-blur-lg'
    }
  },
  {
    id: 'mandalorian',
    name: 'This is the Way',
    series: 'The Mandalorian',
    description: 'Beskar steel and space theme from a galaxy far away',
    preview: 'https://images.pexels.com/photos/8439093/pexels-photo-8439093.jpeg?auto=compress&cs=tinysrgb&w=300',
    colors: {
      primary: '#718096',
      secondary: '#4299e1',
      accent: '#f56565',
      background: '#0d1117',
      surface: '#161b22',
      text: '#f0f6fc',
      textSecondary: '#8b949e',
      border: '#30363d'
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0d1117 0%, #161b22 50%, #21262d 100%)',
      card: 'linear-gradient(145deg, #161b22 0%, #0d1117 100%)',
      button: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
      accent: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
    },
    fonts: {
      primary: 'Exo 2, sans-serif',
      secondary: 'Inter, sans-serif'
    },
    effects: {
      glow: '0 0 30px rgba(66, 153, 225, 0.4)',
      shadow: '0 18px 40px rgba(13, 17, 23, 0.8)',
      blur: 'backdrop-blur-md'
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
    
    root.style.setProperty('--font-primary', theme.fonts.primary);
    root.style.setProperty('--font-secondary', theme.fonts.secondary);
    
    root.style.setProperty('--effect-glow', theme.effects.glow);
    root.style.setProperty('--effect-shadow', theme.effects.shadow);
    root.style.setProperty('--effect-blur', theme.effects.blur);

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