import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import { colors, spacing } from '../theme';

interface CardProps extends ViewProps {
  children: ReactNode;
}

export function Card({ children, style }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.md,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
