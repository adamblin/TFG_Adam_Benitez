import React from 'react';
import { Text } from 'react-native';
import { Card, ProgressBar } from '../../../shared/components';
import { makeStyles } from './FocusTimerCard.styles';
import { useTheme } from '../../../shared/theme';

type FocusTimerCardProps = {
  formattedTime: string;
  statusText: string;
  progressPercent: number;
};

export function FocusTimerCard({ formattedTime, statusText, progressPercent }: FocusTimerCardProps) {
  const colors = useTheme();
  const styles = makeStyles(colors);
  return (
    <Card style={styles.card}>
      <Text style={styles.time}>{formattedTime}</Text>
      <Text style={styles.status}>{statusText}</Text>
      <ProgressBar percent={progressPercent} />
    </Card>
  );
}
