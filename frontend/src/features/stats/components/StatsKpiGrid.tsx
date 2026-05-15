import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { StatsKpi } from '../hooks/useStatsDashboard';
import { styles } from './StatsKpiGrid.styles';

interface StatsKpiGridProps {
  items: StatsKpi[];
}

export function StatsKpiGrid({ items }: StatsKpiGridProps) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={styles.listColumn}
      renderItem={({ item }) => (
        <View style={styles.cardWrap}>
          <Card>
            <View style={styles.cardContent}>
              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          </Card>
        </View>
      )}
    />
  );
}
