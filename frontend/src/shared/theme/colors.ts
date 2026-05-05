export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#0b1020',
  surface: '#1a2940',
  surfaceMuted: '#f3f3f3',
  text: '#FFFFFF',
  textMuted: '#A0A0A0',
  textSecondary: '#A0A0A0',
  placeholderText: '#666666',
  border: '#333333',
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  shadow: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 28,
} as const;

export const radii = {
  sm: 8,
  md: 14,
  lg: 16,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

export const typography = {
  heading: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800' as const,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  buttonLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800' as const,
  },
  fieldLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700' as const,
  },
  body: {
    color: colors.text,
    fontSize: 14,
  },
} as const;
