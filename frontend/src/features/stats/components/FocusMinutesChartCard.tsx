import React from 'react';
import { Text, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Card } from '../../../shared/components';
import { colors } from '../../../shared/theme';
import { StatsPeriod } from '../hooks/useStatsDashboard';
import { styles } from './ChartCards.styles';

interface FocusMinutesChartCardProps {
  period: StatsPeriod;
  labels: string[];
  data: number[];
}

export function FocusMinutesChartCard({ period, labels, data }: FocusMinutesChartCardProps) {
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(280, width - 56);

  return (
    <Card style={styles.cardSpacing}>
      <Text style={styles.cardTitle}>Focus Minutes ({period === 'annual' ? 'Per Month' : 'Trend'})</Text>
      <BarChart
        data={{ labels, datasets: [{ data }] }}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix="m"
        fromZero
        showValuesOnTopOfBars
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          barPercentage: 0.6,
          propsForBackgroundLines: {
            stroke: '#2d3a50',
          },
        }}
        style={{ marginLeft: -14, borderRadius: 12 }}
      />
    </Card>
  );
}
