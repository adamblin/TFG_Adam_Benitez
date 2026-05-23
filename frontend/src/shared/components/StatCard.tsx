import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing } from '../theme';
import { Card } from './Card';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  accentColor?: string;
}

export function StatCard({ value, label, icon, accentColor }: StatCardProps) {
  const colors = useTheme();
  const accent = accentColor ?? colors.primary;
  return (
    <Card style={{ flex: 1, paddingVertical: spacing.md }}>
      {icon && (
        <View style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: `${accent}20`,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.xs,
          borderWidth: 1,
          borderColor: `${accent}35`,
        }}>
          <Ionicons name={icon} size={18} color={accent} />
        </View>
      )}
      <Text style={{ color: colors.text, fontSize: 32, fontWeight: '900', lineHeight: 36 }}>
        {value}
      </Text>
      <Text style={{ color: accent, fontSize: 11, fontWeight: '700', marginTop: 2, letterSpacing: 0.4 }}>
        {label}
      </Text>
    </Card>
  );
}
