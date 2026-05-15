import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { colors, spacing } from '../../../shared/theme';

interface BarChartCardProps {
  title: string;
  labels: string[];
  data: number[];
  color: string;
  yAxisSuffix?: string;
}

const BAR_AREA_HEIGHT = 140;
const LABEL_RESERVE = 24;
const MAX_BAR_HEIGHT = BAR_AREA_HEIGHT - LABEL_RESERVE;

export function BarChartCard({ title, labels, data, color, yAxisSuffix = '' }: BarChartCardProps) {
  const maxValue = useMemo(() => Math.max(...data, 1), [data]);
  const total = useMemo(() => data.reduce((a, b) => a + b, 0), [data]);

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.lg,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 15, fontWeight: '800' }}>{title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
          <Text style={{ color, fontSize: 20, fontWeight: '900', lineHeight: 22 }}>
            {total}
          </Text>
          {yAxisSuffix ? (
            <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{yAxisSuffix}</Text>
          ) : null}
        </View>
      </View>

      <View style={{ position: 'relative', height: BAR_AREA_HEIGHT }}>
        {[0.25, 0.5, 0.75].map((pct, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              top: pct * BAR_AREA_HEIGHT,
              left: 0,
              right: 0,
              height: 1,
              backgroundColor: `${colors.border}66`,
            }}
          />
        ))}

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          {data.map((value, i) => {
            const barHeight = value > 0
              ? Math.max(4, (value / maxValue) * MAX_BAR_HEIGHT)
              : 3;
            const isActive = value > 0;

            return (
              <View key={i} style={{ flex: 1, alignItems: 'center', paddingBottom: 1 }}>
                {isActive ? (
                  <Text
                    style={{
                      color,
                      fontSize: 10,
                      fontWeight: '800',
                      marginBottom: 4,
                      lineHeight: 12,
                    }}
                  >
                    {value}
                    {yAxisSuffix}
                  </Text>
                ) : (
                  <View style={{ height: LABEL_RESERVE }} />
                )}
                <View
                  style={{
                    width: '52%',
                    height: barHeight,
                    backgroundColor: isActive ? color : `${color}20`,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  }}
                />
              </View>
            );
          })}
        </View>
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: colors.border,
          marginBottom: spacing.sm,
        }}
      />

      <View style={{ flexDirection: 'row' }}>
        {labels.map((label, i) => (
          <Text
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              color: colors.textMuted,
              fontSize: 10,
              fontWeight: '600',
            }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
