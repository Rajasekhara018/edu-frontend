/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#1f8b4c';
const tintColorDark = '#f2f0ea';

export const Colors = {
  light: {
    text: '#1a1a1a',
    background: '#fbf6f1',
    tint: tintColorLight,
    icon: '#66706b',
    tabIconDefault: '#66706b',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#f4f2ee',
    background: '#141514',
    tint: tintColorDark,
    icon: '#a3a7a4',
    tabIconDefault: '#a3a7a4',
    tabIconSelected: tintColorDark,
  },
};

export type ThemeName = 'system' | 'light' | 'dark' | 'ocean' | 'sunset' | 'sand';

export type ThemePalette = {
  name: string;
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  card: string;
  cardAlt: string;
  border: string;
  muted: string;
  mutedAlt: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  danger: string;
  warning: string;
  success: string;
  badge: string;
  badgeText: string;
  chip: string;
  chipText: string;
  chipActive: string;
  chipActiveText: string;
};

export const ThemePresets: Record<Exclude<ThemeName, 'system'>, ThemePalette> = {
  light: {
    name: 'Light',
    text: '#1a1a1a',
    background: '#fbf6f1',
    tint: '#1f8b4c',
    icon: '#66706b',
    tabIconDefault: '#66706b',
    tabIconSelected: '#1f8b4c',
    card: '#ffffff',
    cardAlt: '#f1f5f0',
    border: '#e2e7e3',
    muted: '#6c756f',
    mutedAlt: '#9aa39c',
    primary: '#1f8b4c',
    primaryDark: '#1a6f3b',
    primarySoft: '#eaf5ee',
    danger: '#cc4b33',
    warning: '#f4b740',
    success: '#1f8b4c',
    badge: '#e25d3a',
    badgeText: '#ffffff',
    chip: '#f5f1e7',
    chipText: '#4f4f4f',
    chipActive: '#1f8b4c',
    chipActiveText: '#ffffff',
  },
  dark: {
    name: 'Dark',
    text: '#f4f2ee',
    background: '#141514',
    tint: '#f2f0ea',
    icon: '#a3a7a4',
    tabIconDefault: '#a3a7a4',
    tabIconSelected: '#f2f0ea',
    card: '#1f201f',
    cardAlt: '#2a2c2b',
    border: '#2f3331',
    muted: '#b1b7b3',
    mutedAlt: '#8f9591',
    primary: '#6bd18c',
    primaryDark: '#4caf6f',
    primarySoft: '#24342b',
    danger: '#f07a62',
    warning: '#f7c35f',
    success: '#6bd18c',
    badge: '#f07a62',
    badgeText: '#141514',
    chip: '#2a2c2b',
    chipText: '#d7dad7',
    chipActive: '#6bd18c',
    chipActiveText: '#141514',
  },
  ocean: {
    name: 'Ocean',
    text: '#0f2433',
    background: '#f2f8fb',
    tint: '#1d5e91',
    icon: '#5c7687',
    tabIconDefault: '#5c7687',
    tabIconSelected: '#1d5e91',
    card: '#ffffff',
    cardAlt: '#e6f1f7',
    border: '#d7e3ea',
    muted: '#577286',
    mutedAlt: '#8aa0ad',
    primary: '#1d5e91',
    primaryDark: '#174a72',
    primarySoft: '#d6e8f6',
    danger: '#e1644c',
    warning: '#f2a34f',
    success: '#1f8b4c',
    badge: '#f27b4a',
    badgeText: '#ffffff',
    chip: '#e9f2f8',
    chipText: '#345061',
    chipActive: '#1d5e91',
    chipActiveText: '#ffffff',
  },
  sunset: {
    name: 'Sunset',
    text: '#3b1d12',
    background: '#fff4ed',
    tint: '#f26b3a',
    icon: '#7b5a4a',
    tabIconDefault: '#7b5a4a',
    tabIconSelected: '#f26b3a',
    card: '#ffffff',
    cardAlt: '#ffe7dc',
    border: '#f0d7c9',
    muted: '#7a5c4f',
    mutedAlt: '#a48a7e',
    primary: '#f26b3a',
    primaryDark: '#d7582f',
    primarySoft: '#ffe1d3',
    danger: '#c83f2d',
    warning: '#f2a243',
    success: '#2d9a63',
    badge: '#f26b3a',
    badgeText: '#ffffff',
    chip: '#fff0e6',
    chipText: '#6a4a3d',
    chipActive: '#f26b3a',
    chipActiveText: '#ffffff',
  },
  sand: {
    name: 'Sand',
    text: '#2a241e',
    background: '#faf7f0',
    tint: '#8b6b3e',
    icon: '#6f6154',
    tabIconDefault: '#6f6154',
    tabIconSelected: '#8b6b3e',
    card: '#ffffff',
    cardAlt: '#f1e7d7',
    border: '#e6dac8',
    muted: '#6f6154',
    mutedAlt: '#998b7d',
    primary: '#8b6b3e',
    primaryDark: '#6f5631',
    primarySoft: '#efe3d2',
    danger: '#c25440',
    warning: '#d49d4b',
    success: '#3e8b5a',
    badge: '#c25440',
    badgeText: '#ffffff',
    chip: '#f3eadc',
    chipText: '#5d4a35',
    chipActive: '#8b6b3e',
    chipActiveText: '#ffffff',
  },
};

export const ThemeLabels: Record<ThemeName, string> = {
  system: 'System',
  light: 'Light',
  dark: 'Dark',
  ocean: 'Ocean',
  sunset: 'Sunset',
  sand: 'Sand',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
