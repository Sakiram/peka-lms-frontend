import { useState, useEffect } from 'react';

export type ThemeVariant = 'light' | 'dark';

const THEME_KEY = 'app-theme';

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeVariant>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as ThemeVariant | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    const initialTheme = savedTheme || systemTheme;
    setThemeState(initialTheme as ThemeVariant);
    applyTheme(initialTheme as ThemeVariant);
    setMounted(true);
  }, []);

  // Apply theme to DOM
  const applyTheme = (newTheme: ThemeVariant) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(newTheme);
    
    // Save to localStorage
    localStorage.setItem(THEME_KEY, newTheme);
  };

  const setTheme = (newTheme: ThemeVariant) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  return { theme, setTheme, mounted };
};