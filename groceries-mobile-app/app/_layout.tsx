import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React, { useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CartProvider } from '@/context/CartContext';
import { ThemeSettingsProvider, useTheme } from '@/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppShell() {
  const { palette, resolvedTheme } = useTheme();

  const navTheme = useMemo(() => {
    const base = resolvedTheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: palette.background,
        card: palette.card,
        text: palette.text,
        border: palette.border,
        primary: palette.primary,
      },
    };
  }, [palette, resolvedTheme]);

  return (
    <ThemeProvider value={navTheme}>
      <CartProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      </CartProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeSettingsProvider>
        <AppShell />
      </ThemeSettingsProvider>
    </SafeAreaProvider>
  );
}
