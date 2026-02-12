/**
 * Glisten Mind — Dark night-sky theme for a calming destress app.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // App is dark-only, but we keep this for compatibility
    text: '#E8E4FF',
    background: '#0D0B1A',
    tint: '#8B80F9',
    icon: '#9490B8',
    tabIconDefault: '#9490B8',
    tabIconSelected: '#8B80F9',
  },
  dark: {
    text: '#E8E4FF',
    background: '#0D0B1A',
    tint: '#8B80F9',
    icon: '#9490B8',
    tabIconDefault: '#9490B8',
    tabIconSelected: '#8B80F9',
  },
};

/** Glisten Mind palette */
export const GlistenColors = {
  background: '#0D0B1A',
  surface: '#1A1730',
  surfaceGlass: 'rgba(40, 35, 75, 0.5)',
  surfaceBorder: 'rgba(120, 110, 180, 0.15)',
  primary: '#8B80F9',
  primaryMuted: '#5A4FCF',
  textPrimary: '#E8E4FF',
  textSecondary: '#9490B8',
  textMuted: '#6B6890',
  orbGlow: '#6C5CE7',
  orbEdge: '#1A1730',
  scoreGreen: '#7BEDA0',
  heartPink: '#F97B9D',
  breathBlue: '#7BB8ED',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter_400Regular',
    sansMedium: 'Inter_500Medium',
    sansSemiBold: 'Inter_600SemiBold',
    sansBold: 'Inter_700Bold',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter_400Regular',
    sansMedium: 'Inter_500Medium',
    sansSemiBold: 'Inter_600SemiBold',
    sansBold: 'Inter_700Bold',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    sansMedium: "'Inter', system-ui, -apple-system, sans-serif",
    sansSemiBold: "'Inter', system-ui, -apple-system, sans-serif",
    sansBold: "'Inter', system-ui, -apple-system, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, monospace",
  },
});
