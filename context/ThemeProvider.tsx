'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState('');
  const handleThemechange = useCallback(() => {
    if (mode !== 'dark') {
      setMode('light');
      document.documentElement.classList.add('light');
    } else {
      setMode('dark');
      document.documentElement.classList.add('dark');
    }
  }, [mode]);

  useEffect(() => {
    handleThemechange();
  }, [mode, handleThemechange]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('usetheme must be used within a Theme Provider');
  }

  return context;
}