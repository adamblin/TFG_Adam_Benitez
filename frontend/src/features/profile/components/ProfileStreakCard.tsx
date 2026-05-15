import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

type Props = {
  currentStreak: number;
  longestStreak: number;
  activeDaysThisWeek: boolean[];
};

export function ProfileStreakCard({ currentStreak, longestStreak, activeDaysThisWeek }: Props) {
  return (
    <Card style={{ marginBottom: spacing.sm }}>
      {/* Top: streak count + flame */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }}>
        <View>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: spacing.xs }}>
            CURRENT STREAK
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm }}>
            <Text style={{ color: colors.primary, fontSize: 56, fontWeight: '900', lineHeight: 60 }}>
              {currentStreak}
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 16, fontWeight: '700', paddingBottom: 8 }}>
              {currentStreak === 1 ? 'day' : 'days'}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 52, lineHeight: 60 }}>🔥</Text>
      </View>

      {/* Week progress dots */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
        {activeDaysThisWeek.map((active, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
            <View style={{
              width: '100%',
              aspectRatio: 1,
              borderRadius: 8,
              backgroundColor: active ? colors.primary : `${colors.primary}18`,
              borderWidth: 1,
              borderColor: active ? colors.primary : colors.border,
            }} />
            <Text style={{
              color: active ? colors.primary : colors.textMuted,
              fontSize: 10,
              fontWeight: '700',
            }}>
              {DOW[i]}
            </Text>
          </View>
        ))}
      </View>

      {/* Bottom: best streak */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
        <Text style={{ color: colors.textMuted, fontSize: 13 }}>Best streak</Text>
        <Text style={{ color: colors.text, fontSize: 13, fontWeight: '800' }}>
          {longestStreak} {longestStreak === 1 ? 'day' : 'days'}
        </Text>
      </View>
    </Card>
  );
}
