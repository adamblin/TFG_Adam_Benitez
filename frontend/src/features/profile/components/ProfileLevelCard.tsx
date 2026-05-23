import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../../shared/components';
import { useTheme, spacing } from '../../../shared/theme';

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
  const colors = useTheme();
  const title = getLevelTitle(level);

  return (
    <Card style={{ marginBottom: spacing.sm }}>
      {/* Header row: level badge + title + total XP */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg }}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.7,
            shadowRadius: 14,
            elevation: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '900', lineHeight: 30 }}>
            {level}
          </Text>
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: 2 }}>
            LEVEL {level}
          </Text>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>
            {title}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
            {totalXp.toLocaleString()} XP total
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={{ marginBottom: spacing.md }}>
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
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ height: '100%', width: `${Math.max(2, progressPercent)}%`, borderRadius: 4 }}
          />
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
          <View style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: `${colors.warning}20`,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: `${colors.warning}40`,
          }}>
            <Ionicons name="logo-bitcoin" size={18} color={colors.warning} />
          </View>
          <View>
            <Text style={{ color: colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 0.6 }}>
              COINS
            </Text>
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900', lineHeight: 22 }}>
              {coins.toLocaleString()}
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
