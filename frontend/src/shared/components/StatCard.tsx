import React from 'react';
import { View, Text } from 'react-native';
import { colors, spacing } from '../theme';
import { Card } from './Card';

interface StatCardProps {
  value: string | number;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <Card style={{ flex: 1, padding: spacing.md }}>
      <Text style={{ color: colors.text, fontSize: 38, fontWeight: '900', lineHeight: 42, marginBottom: spacing.xs }}>
        {value}
      </Text>
      <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </Card>
  );
}
