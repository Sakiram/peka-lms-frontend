import React, { createContext, useContext } from 'react';
import { useTheme as useThemeHook, type ColorScheme, type Mode } from '@/hooks/useTheme';

interface ThemeContextType {
  colorScheme: ColorScheme;
  mode: Mode;
  changeScheme: (scheme: ColorScheme) => void;
  toggleMode: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useThemeHook();
  
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};