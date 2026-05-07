import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { colors, spacing } from '../theme';

interface ActionCardProps {
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export function ActionCard({ title, subtitle, onPress }: ActionCardProps) {
  return (
    <TouchableOpacity
      style={{
        width: '48.8%',
        backgroundColor: colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        minHeight: 112,
        justifyContent: 'space-between',
      }}
      onPress={onPress}
    >
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: '900', lineHeight: 34, marginBottom: spacing.xs }}>
        {title}
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: 13 }}>{subtitle}</Text>
    </TouchableOpacity>
  );
}
