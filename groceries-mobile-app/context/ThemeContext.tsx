import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { ThemeLabels, ThemeName, ThemePalette, ThemePresets } from '@/constants/theme';
import { useProfile } from '@/context/ProfileContext';

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (next: ThemeName) => void;
  resolvedTheme: Exclude<ThemeName, 'system'>;
  palette: ThemePalette;
  label: string;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme() ?? 'light';
  const [theme, setTheme] = useState<ThemeName>('system');
  const { profile } = useProfile();

  const resolvedTheme =
    theme === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : theme;

  const palette = useMemo(() => {
    if (resolvedTheme === 'light') {
      return profile.theme.light;
    }
    if (resolvedTheme === 'dark') {
      return profile.theme.dark;
    }
    return ThemePresets[resolvedTheme];
  }, [profile.theme.dark, profile.theme.light, resolvedTheme]);
  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      palette,
      label: ThemeLabels[theme],
    }),
    [theme, resolvedTheme, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeSettingsProvider');
  }
  return ctx;
}
