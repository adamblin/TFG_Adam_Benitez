import React from 'react';
import { Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Card } from '../../../shared/components';
import { styles } from './ChartCards.styles';

interface CompletionDonutCardProps {
  completed: number;
  pending: number;
}

export function CompletionDonutCard({ completed, pending }: CompletionDonutCardProps) {
  const total = completed + pending;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card style={styles.cardSpacing}>
      <Text style={styles.cardTitle}>Tasks Done vs Pending</Text>
      <View style={{ alignItems: 'center' }}>
        <PieChart
          data={[
            {
              name: 'Completed',
              population: completed,
              color: '#34C759',
              legendFontColor: '#FFFFFF',
              legendFontSize: 12,
            },
            {
              name: 'Pending',
              population: pending,
              color: '#FF9500',
              legendFontColor: '#FFFFFF',
              legendFontSize: 12,
            },
          ]}
          width={280}
          height={180}
          chartConfig={{
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="16"
          absolute
          hasLegend
        />
        <Text style={styles.legendText}>{completionRate}% completed</Text>
      </View>
    </Card>
  );
}
