import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';

const LEVEL_TITLES: [number, string][] = [
  [20, 'Legend'],
  [15, 'Master'],
  [10, 'Expert'],
  [7,  'Achiever'],
  [4,  'Explorer'],
  [1,  'Beginner'],
];

function getLevelTitle(level: number): string {
  for (const [min, title] of LEVEL_TITLES) {
    if (level >= min) return title;
  }
  return 'Beginner';
}

type Props = {
  level: number;
  xpInLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
  totalXp: number;
  coins: number;
};

export function ProfileLevelCard({ level, xpInLevel, xpToNextLevel, progressPercent, totalXp, coins }: Props) {
  const title = getLevelTitle(level);

  return (
    <Card style={{ marginBottom: spacing.sm }}>
      {/* Header row: level badge + title + total XP */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg }}>
        <View style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: spacing.md,
        }}>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', lineHeight: 30 }}>
            {level}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 2 }}>
            LEVEL {level}
          </Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>
            {title}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
            {totalXp} XP total
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={{ marginBottom: spacing.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 }}>
            PROGRESS TO LEVEL {level + 1}
          </Text>
          <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>
            {xpInLevel} / {xpToNextLevel} XP
          </Text>
        </View>

        {/* Track */}
        <View style={{
          height: 8,
          backgroundColor: `${colors.primary}22`,
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <View style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: colors.primary,
            borderRadius: 4,
          }} />
        </View>
      </View>

      {/* Coin balance */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Text style={{ fontSize: 20 }}>🪙</Text>
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 0.6 }}>
              COINS
            </Text>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900', lineHeight: 22 }}>
              {coins}
            </Text>
          </View>
        </View>

        <View style={{ alignItems: 'flex-end', gap: 2 }}>
          <Text style={{ color: colors.textMuted, fontSize: 10 }}>+10 first action/day</Text>
          <Text style={{ color: colors.textMuted, fontSize: 10 }}>+N on level up</Text>
        </View>
      </View>
    </Card>
  );
}
