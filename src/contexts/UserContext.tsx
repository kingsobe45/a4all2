import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  badges: string[];
  followers: number;
  following: number;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateXP: (points: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    username: 'AI_Explorer',
    email: 'explorer@a4all.com',
    xp: 2450,
    level: 12,
    badges: ['Verified', 'AI Whisperer', 'Trend Hunter'],
    followers: 1247,
    following: 892,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  });

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const updateXP = (points: number) => {
    if (user) {
      const newXP = user.xp + points;
      const newLevel = Math.floor(newXP / 200) + 1;
      setUser({ ...user, xp: newXP, level: newLevel });
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateXP }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}