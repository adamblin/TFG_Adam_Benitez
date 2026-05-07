import React from 'react';
import { Text } from 'react-native';
import { Card, ProgressBar } from '../../../shared/components';
import { styles } from './FocusTimerCard.styles';

type FocusTimerCardProps = {
  formattedTime: string;
  statusText: string;
  progressPercent: number;
};

export function FocusTimerCard({ formattedTime, statusText, progressPercent }: FocusTimerCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.time}>{formattedTime}</Text>
      <Text style={styles.status}>{statusText}</Text>
      <ProgressBar percent={progressPercent} />
    </Card>
  );
}
