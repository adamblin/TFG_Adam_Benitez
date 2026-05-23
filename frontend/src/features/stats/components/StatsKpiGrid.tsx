import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { StatsKpi } from '../hooks/useStatsDashboard';
import { makeStyles } from './StatsKpiGrid.styles';
import { useTheme } from '../../../shared/theme';

interface StatsKpiGridProps {
  items: StatsKpi[];
}

export function StatsKpiGrid({ items }: StatsKpiGridProps) {
  const colors = useTheme();
  const styles = makeStyles(colors);
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
