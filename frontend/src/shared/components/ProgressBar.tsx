import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../theme';

interface ProgressBarProps extends ViewProps {
  percent: number;
}

export function ProgressBar({ percent, style }: ProgressBarProps) {
  const colors = useTheme();
  return (
    <View
      style={[
        {
          height: 8,
          borderRadius: 999,
          backgroundColor: colors.surface,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${Math.min(percent, 100)}%`,
          height: '100%',
          backgroundColor: colors.primary,
          borderRadius: 999,
        }}
      />
    </View>
  );
}
