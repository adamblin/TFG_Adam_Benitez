import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../shared/components';
import type { ProfileSummaryRow } from '../hooks/useProfileScreen';
import { useTheme, spacing } from '../../../shared/theme';

type ProfileAccountSummaryCardProps = {
  rows: ProfileSummaryRow[];
};

const ROW_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  'checkmark-done',
  'hourglass-outline',
  'speedometer-outline',
];

export function ProfileAccountSummaryCard({ rows }: ProfileAccountSummaryCardProps) {
  const colors = useTheme();
  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <Text style={{
        color: colors.primary,
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1.2,
        marginBottom: spacing.sm,
      }}>
        ACCOUNT STATUS
      </Text>
      {rows.map((row, i) => (
        <View key={row.label} style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Ionicons
              name={ROW_ICONS[i] ?? 'ellipse-outline'}
              size={16}
              color={colors.textMuted}
            />
            <Text style={{ color: colors.textMuted, fontSize: 13 }}>{row.label}</Text>
          </View>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>{row.value}</Text>
        </View>
      ))}
    </Card>
  );
}
