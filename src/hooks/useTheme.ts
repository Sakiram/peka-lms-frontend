import { useState, useEffect } from 'react';

export type ColorScheme = 'default' | 'purple' | 'caffine';
export type Mode = 'light' | 'dark';

const SCHEME_KEY = 'color-scheme';
const MODE_KEY = 'color-mode';

export const useTheme = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('default');
  const [mode, setMode] = useState<Mode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedScheme = (localStorage.getItem(SCHEME_KEY) as ColorScheme) || 'default';
    const savedMode = (localStorage.getItem(MODE_KEY) as Mode) || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    setColorScheme(savedScheme);
    setMode(savedMode);
    applyTheme(savedScheme, savedMode);
    setMounted(true);
  }, []);

  const applyTheme = (scheme: ColorScheme, themeMode: Mode) => {
    const root = document.documentElement;
    
    // Remove all scheme and mode classes
    root.classList.remove('default', 'purple', 'caffine', 'light', 'dark');
    
    // Apply new classes
    root.classList.add(scheme, themeMode);
    
    // Save to localStorage
    localStorage.setItem(SCHEME_KEY, scheme);
    localStorage.setItem(MODE_KEY, themeMode);
  };

  const changeScheme = (scheme: ColorScheme) => {
    setColorScheme(scheme);
    applyTheme(scheme, mode);
  };

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    applyTheme(colorScheme, newMode);
  };

  return { colorScheme, mode, changeScheme, toggleMode, mounted };
};