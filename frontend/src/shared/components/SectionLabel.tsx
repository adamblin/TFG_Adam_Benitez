import React from 'react';
import { Text, TextProps } from 'react-native';
import { colors } from '../theme';

interface SectionLabelProps extends TextProps {
  children: string;
}

export function SectionLabel({ children, style, ...props }: SectionLabelProps) {
  return (
    <Text
      style={[
        {
          color: colors.textMuted,
          fontSize: 12,
          fontWeight: '800',
          letterSpacing: 1,
          marginBottom: 8,
          marginTop: 16,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
