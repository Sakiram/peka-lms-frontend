import { useState, useEffect } from 'react';

export type ColorScheme = 'default' | 'purple' | 'blue' | 'pink' | 'vintage' | 'cyberPunk' | 'claude' | 't3';
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
    
    root.classList.remove('default', 'purple', 'blue', 'pink', 'vintage', 'cyberPunk', 'claude', 't3', 'light', 'dark');
    
    root.classList.add(scheme, themeMode);
    
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