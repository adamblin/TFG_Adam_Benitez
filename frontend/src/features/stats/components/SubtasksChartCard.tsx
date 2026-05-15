import React from 'react';
import { Text, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card } from '../../../shared/components';
import { colors } from '../../../shared/theme';
import { StatsPeriod } from '../hooks/useStatsDashboard';
import { styles } from './ChartCards.styles';

interface SubtasksChartCardProps {
  period: StatsPeriod;
  labels: string[];
  data: number[];
}

export function SubtasksChartCard({ period, labels, data }: SubtasksChartCardProps) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(280, width - 56);

  return (
    <Card style={styles.cardSpacing}>
      <Text style={styles.cardTitle}>Completed Subtasks ({period === 'annual' ? 'By Quarter' : 'Trend'})</Text>
      <LineChart
        data={{ labels, datasets: [{ data, color: () => '#34C759' }] }}
        width={chartWidth}
        height={220}
        yAxisSuffix=""
        fromZero
        withInnerLines
        withOuterLines={false}
        withShadow={false}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#34C759',
          },
          propsForBackgroundLines: {
            stroke: '#2d3a50',
          },
        }}
        bezier
        style={{ marginLeft: -14, borderRadius: 12 }}
      />
    </Card>
  );
}
