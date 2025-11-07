import '@/styles/default.css';
import '@/styles/purple.css';
import '@/styles/theme.css';

export type ThemeVariant = 'default' | 'purple' | 'theme';

export interface ThemeConfig {
  light: string;
  dark: string;
}

export const themes: Record<ThemeVariant, ThemeConfig> = {
  default: {
    light: 'default',
    dark: 'dark',
  },
  purple: {
    light: 'brand',
    dark: 'brand-dark',
  },
  theme: {
    light: 'highcontrast',
    dark: 'highcontrast-dark',
  },
};
