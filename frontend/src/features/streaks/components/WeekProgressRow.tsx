import React from 'react';
import { View, Text } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';

type Props = { week: boolean[] };

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeekProgressRow({ week }: Props) {
  return (
    <Card style={{ padding: spacing.md, marginBottom: spacing.lg, borderRadius: 12 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {dayNames.map((d, i) => {
          const done = !!week[i];
          return (
            <View key={d} style={{ alignItems: 'center', width: 36 }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: done ? colors.primary : 'transparent',
                borderWidth: done ? 0 : 1,
                borderColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.xs,
              }}>
                {done
                  ? <Text style={{ fontSize: 18, color: colors.background }}>✓</Text>
                  : <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border }} />
                }
              </View>
              <Text style={{ color: done ? colors.text : colors.textMuted, fontSize: 12 }}>{d}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
