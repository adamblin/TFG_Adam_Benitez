import React from 'react';
import { Text } from 'react-native';
import { Card } from '../../../shared/components';
import { styles } from './ProfileRecentSessionsCard.styles';

type ProfileRecentSessionsCardProps = {
  sessions: string[];
};

export function ProfileRecentSessionsCard({ sessions }: ProfileRecentSessionsCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>RECENT SESSIONS</Text>
      {sessions.length === 0 ? (
        <Text style={styles.empty}>No focus sessions stored yet.</Text>
      ) : (
        sessions.map((session) => (
          <Text key={session} style={styles.item}>
            {session}
          </Text>
        ))
      )}
    </Card>
  );
}
