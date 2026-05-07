import React from 'react';
import { View, ViewProps } from 'react-native';
import { colors } from '../theme';

interface ProgressBarProps extends ViewProps {
  percent: number;
}

export function ProgressBar({ percent, style }: ProgressBarProps) {
  return (
    <View
      style={[
        {
          height: 12,
          borderRadius: 999,
          backgroundColor: '#0d162a',
          borderWidth: 1,
          borderColor: colors.border,
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
