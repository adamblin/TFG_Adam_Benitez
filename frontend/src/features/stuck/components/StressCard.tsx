import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../../shared/components';
import { useTheme, spacing } from '../../../shared/theme';
import type { StressInfo } from '../hooks/useStuckScreen';

type Props = {
  stress: StressInfo;
  barColor: string;
};

export function StressCard({ stress, barColor }: Props) {
  const colors = useTheme();

  return (
    <Card style={{ marginBottom: spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
        <Text style={{ color: colors.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 0.8 }}>
          CURRENT LOAD
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: `${barColor}20`,
          borderRadius: 20,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderWidth: 1,
          borderColor: `${barColor}40`,
        }}>
          <Text style={{ color: barColor, fontSize: 12, fontWeight: '800' }}>
            {stress.label}
          </Text>
          <Text style={{ fontSize: 12 }}>{stress.emoji}</Text>
        </View>
      </View>

      {/* Stress bar track */}
      <View style={{
        height: 8,
        borderRadius: 4,
        backgroundColor: `${barColor}22`,
        overflow: 'hidden',
      }}>
        <LinearGradient
          colors={[barColor, `${barColor}99`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${Math.max(4, stress.percent)}%`, height: '100%', borderRadius: 4 }}
        />
      </View>
    </Card>
  );
}
