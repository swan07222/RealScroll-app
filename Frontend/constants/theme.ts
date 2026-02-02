// constants/theme.ts
import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#000000',
    secondary: '#666666',
    background: '#FFFCF9',
    surface: '#FFFFFF',
    surfaceSecondary: '#F5F5F5',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textPlaceholder: '#CCCCCC',
    border: '#EEEEEE',
    borderSecondary: '#F0F0F0',
    success: '#22C55E',
    successBackground: '#E6FCE8',
    error: '#EF4444',
    errorBackground: '#FEE2E2',
    warning: '#F59E0B',
    warningBackground: '#FEF3C7',
    info: '#3B82F6',
    infoBackground: '#DBEAFE',
    tint: '#0A7EA4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0A7EA4',
    overlay: 'rgba(0, 0, 0, 0.5)',
    keypad: '#CED2D9',
    keypadKey: '#FCFCFE',
  },
  dark: {
    primary: '#FFFFFF',
    secondary: '#A0A0A0',
    background: '#151718',
    surface: '#1E1E1E',
    surfaceSecondary: '#2A2A2A',
    text: '#ECEDEE',
    textSecondary: '#A0A0A0',
    textTertiary: '#666666',
    textPlaceholder: '#444444',
    border: '#333333',
    borderSecondary: '#2A2A2A',
    success: '#22C55E',
    successBackground: '#1A3D1F',
    error: '#EF4444',
    errorBackground: '#3D1A1A',
    warning: '#F59E0B',
    warningBackground: '#3D2E0F',
    info: '#3B82F6',
    infoBackground: '#1A2A3D',
    tint: '#FFFFFF',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.7)',
    keypad: '#2A2A2A',
    keypadKey: '#3A3A3A',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    sansBold: 'System',
    serif: 'Georgia',
    rounded: 'SF Pro Rounded',
    mono: 'Menlo',
  },
  android: {
    sans: 'Roboto',
    sansBold: 'Roboto-Bold',
    serif: 'serif',
    rounded: 'Roboto',
    mono: 'monospace',
  },
  default: {
    sans: 'System',
    sansBold: 'System',
    serif: 'serif',
    rounded: 'System',
    mono: 'monospace',
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 26,
  display: 28,
  hero: 32,
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
};