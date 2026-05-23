import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import { spacing } from '../theme/colors';

interface CardProps extends ViewProps {
  children: ReactNode;
}

export function Card({ children, style, ...rest }: CardProps) {
  const colors = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: `${colors.primary}45`,
          borderTopColor: `${colors.primary}85`,
          padding: spacing.md,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 8,
          overflow: 'hidden',
        },
        style,
      ]}
      {...rest}
    >
      {/* Subtle top sheen — does not block touch */}
      <LinearGradient
        colors={[`${colors.primary}14`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 72 }}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}
