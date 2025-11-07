import { useState, useEffect } from 'react';

export type ThemeVariant = 'light' | 'dark' | 'purple' | 'highcontrast';

const THEME_KEY = 'app-theme';

export const useTheme = () => {
  const [theme, setThemeState] = useState<ThemeVariant>('light');
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as ThemeVariant | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    const initialTheme = savedTheme || systemTheme;
    setThemeState(initialTheme as ThemeVariant);
    applyTheme(initialTheme as ThemeVariant);
    setMounted(true);
  }, []);
  const applyTheme = (newTheme: ThemeVariant) => {
    const root = document.documentElement;    
    root.classList.remove('light', 'dark', 'brand', 'highcontrast');    
    root.classList.add(newTheme);    
    localStorage.setItem(THEME_KEY, newTheme);
  };

  const setTheme = (newTheme: ThemeVariant) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  return { theme, setTheme, mounted };
};