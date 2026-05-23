import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { useTheme } from '../theme';
import { spacing } from '../theme/colors';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ label, variant = 'primary', style, ...props }: ButtonProps) {
  const colors = useTheme();

  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          button: {
            backgroundColor: colors.primary,
            paddingVertical: spacing.md + 2,
            borderRadius: 14,
            alignItems: 'center' as const,
            borderWidth: 0,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            elevation: 6,
          },
          label: {
            color: '#ffffff',
            fontSize: 16,
            fontWeight: '800' as const,
            letterSpacing: 0.6,
          },
        };
      case 'secondary':
        return {
          button: {
            backgroundColor: colors.surface,
            paddingVertical: spacing.md,
            borderRadius: 14,
            alignItems: 'center' as const,
            borderWidth: 1,
            borderColor: `${colors.primary}40`,
          },
          label: {
            color: colors.text,
            fontSize: 15,
            fontWeight: '600' as const,
            letterSpacing: 0.3,
          },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            paddingVertical: spacing.lg,
            borderRadius: 999,
            alignItems: 'center' as const,
            borderWidth: 2,
            borderColor: `${colors.primary}60`,
          },
          label: {
            color: colors.text,
            fontSize: 18,
            fontWeight: '900' as const,
          },
        };
      default:
        return { button: {}, label: {} };
    }
  };

  const styles = getStyles();

  return (
    <TouchableOpacity style={[styles.button, style]} {...props}>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}
