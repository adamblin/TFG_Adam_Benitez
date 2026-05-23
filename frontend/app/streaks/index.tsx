import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageShell, SectionLabel } from '../../src/shared/components';
import { useTheme, spacing } from '../../src/shared/theme';
import { StreakHeaderCard } from '../../src/features/streaks/components/StreakHeaderCard';
import { WeekProgressRow } from '../../src/features/streaks/components/WeekProgressRow';
import { AchievementCard } from '../../src/features/streaks/components/AchievementCard';
import { MonthProgressGrid } from '../../src/features/streaks/components/MonthProgressGrid';
import { useStreak } from '../../src/features/streaks/hooks/useStreak';
import { useFocusSessions } from '../../src/features/focus/hooks/useFocusSessions';
import type { FocusSession } from '../../src/services/focus.service';

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

function buildWeekArray(sessions: FocusSession[]): boolean[] {
  const now       = new Date();
  const dayOfWeek = now.getDay();
  const monFirst  = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (monFirst - i));
    if (i > monFirst) return false;
    return sessions.some((s) => s.completed && isSameDay(new Date(s.startedAt), d));
  });
}

export default function StreaksScreen() {
  const colors = useTheme();
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const { data: streak }        = useStreak();
  const { data: sessions = [] } = useFocusSessions();

  const streakDays    = streak?.currentStreak  ?? 0;
  const longestStreak = streak?.longestStreak  ?? 0;
  const week          = useMemo(() => buildWeekArray(sessions), [sessions]);

  const achievements = useMemo(
    () => [
      { id: 'a1', title: '3 days',   subtitle: 'First streak',  unlocked: longestStreak >= 3  },
      { id: 'a2', title: '1 week',   subtitle: 'A full week',   unlocked: longestStreak >= 7  },
      { id: 'a3', title: '2 weeks',  subtitle: 'Consistency',   unlocked: longestStreak >= 14 },
      { id: 'a4', title: '1 month',  subtitle: 'Habit formed',  unlocked: longestStreak >= 30 },
    ],
    [longestStreak],
  );

  return (
    <PageShell>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.lg }}>
        <View>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 2 }}>
            Build habits daily
          </Text>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', lineHeight: 32 }}>
            Streaks
          </Text>
        </View>
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: `${colors.warning}20`,
          borderWidth: 1,
          borderColor: `${colors.warning}40`,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="flame" size={20} color={colors.warning} />
        </View>
      </View>

      <StreakHeaderCard days={streakDays} />

      {/* Weekly / Monthly toggle */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        padding: 4,
        gap: 4,
        marginBottom: spacing.md,
      }}>
        {(['weekly', 'monthly'] as const).map((mode) => (
          <TouchableOpacity
            key={mode}
            onPress={() => setViewMode(mode)}
            style={{
              flex: 1,
              paddingVertical: spacing.sm,
              borderRadius: 11,
              alignItems: 'center',
              backgroundColor: viewMode === mode ? colors.primary : 'transparent',
            }}
          >
            <Text style={{
              color: viewMode === mode ? '#ffffff' : colors.textMuted,
              fontWeight: '700',
              fontSize: 13,
            }}>
              {mode === 'weekly' ? 'Weekly' : 'Monthly'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === 'weekly' ? (
        <>
          <SectionLabel>THIS WEEK</SectionLabel>
          <WeekProgressRow week={week} />
        </>
      ) : (
        <>
          <SectionLabel>THIS MONTH</SectionLabel>
          <MonthProgressGrid />
        </>
      )}

      <SectionLabel>ACHIEVEMENTS</SectionLabel>
      <FlatList
        data={achievements}
        keyExtractor={(it) => it.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: spacing.md }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginRight: 8 }}>
            <AchievementCard title={item.title} subtitle={item.subtitle} unlocked={item.unlocked} />
          </View>
        )}
      />
    </PageShell>
  );
}
