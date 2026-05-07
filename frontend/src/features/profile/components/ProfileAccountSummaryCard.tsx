import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import type { ProfileSummaryRow } from '../hooks/useProfileScreen';
import { styles } from './ProfileAccountSummaryCard.styles';

type ProfileAccountSummaryCardProps = {
  rows: ProfileSummaryRow[];
};

export function ProfileAccountSummaryCard({ rows }: ProfileAccountSummaryCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>ACCOUNT STATUS</Text>
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.rowLabel}>{row.label}</Text>
          <Text style={styles.rowValue}>{row.value}</Text>
        </View>
      ))}
    </Card>
  );
}
