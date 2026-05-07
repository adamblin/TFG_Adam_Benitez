import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { colors, spacing } from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ label, variant = 'primary', style, ...props }: ButtonProps) {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          button: {
            backgroundColor: colors.primary,
            paddingVertical: spacing.md,
            borderRadius: 10,
            alignItems: 'center' as const,
          },
          label: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '700' as const,
          },
        };
      case 'secondary':
        return {
          button: {
            backgroundColor: colors.surface,
            paddingVertical: spacing.md,
            borderRadius: 10,
            alignItems: 'center' as const,
            borderWidth: 1,
            borderColor: colors.border,
          },
          label: {
            color: colors.text,
            fontSize: 16,
            fontWeight: '700' as const,
          },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: colors.background,
            paddingVertical: spacing.lg,
            borderRadius: 999,
            alignItems: 'center' as const,
            borderWidth: 2,
            borderColor: colors.text,
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
