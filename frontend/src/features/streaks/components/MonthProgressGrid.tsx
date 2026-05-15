import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

export function MonthProgressGrid() {
  const days = Array.from({ length: 28 }).map((_, i) => ({
    id: String(i),
    done: Math.random() > 0.6,
  }));

  return (
    <View style={{ marginBottom: spacing.md }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {days.map((d) => (
          <TouchableOpacity
            key={d.id}
            activeOpacity={0.8}
            style={{
              width: '13%',
              aspectRatio: 1,
              backgroundColor: d.done ? colors.primary : colors.surface,
              marginBottom: spacing.sm,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: d.done ? colors.background : colors.text, fontSize: 12 }}>{d.done ? '✓' : ''}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
 }
