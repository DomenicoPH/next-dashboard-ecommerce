'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext debe usarse dentro de ThemeProviderCustom');
  return context;
};

export const ThemeProviderCustom: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode | null>(null);

  useEffect(() => {
    const savedMode = (localStorage.getItem('theme') as ThemeMode) || 'light';
    setMode(savedMode);
  }, []);

  const toggleTheme = () => {
    if (!mode) return;
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  // Mientras no tenemos el modo, no renderizamos nada → evita hydration error
  if (mode === null) return null;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};