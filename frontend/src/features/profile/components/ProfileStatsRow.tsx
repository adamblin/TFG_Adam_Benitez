import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../../../shared/components';
import type { ProfileStat } from '../hooks/useProfileScreen';
import { styles } from './ProfileStatsRow.styles';

type ProfileStatsRowProps = {
  stats: ProfileStat[];
};

export function ProfileStatsRow({ stats }: ProfileStatsRowProps) {
  return (
    <View style={styles.row}>
      {stats.map((stat) => (
        <Card key={stat.label} style={styles.statCard}>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </Card>
      ))}
    </View>
  );
}
