import React, { useMemo } from 'react';
import { Alert, Text, View } from 'react-native';
import { PageShell, SectionLabel } from '../../src/shared/components';
import {
  ProfileHeaderCard,
  ProfileStatsRow,
  ProfileAccountSummaryCard,
  ProfileRecentSessionsCard,
  ProfileLogoutButton,
  ProfileStreakCard,
  ProfileLevelCard,
} from '../../src/features/profile/components';
import { useProfileScreen } from '../../src/features/profile/hooks/useProfileScreen';
import { useStreak } from '../../src/features/streaks/hooks/useStreak';
import { useUserXP } from '../../src/features/xp/hooks/useUserXP';
import { useFocusSessions } from '../../src/features/focus/hooks/useFocusSessions';
import { usePreferences } from '../../src/features/shop/hooks/useShop';
import {
  AnnualCalendarHeatmap,
  BarChartCard,
  BestDayCard,
  MonthlyCalendarCard,
  PeriodSegmentedControl,
  RadialWeekChart,
  StatsKpiGrid,
  TodayBanner,
} from '../../src/features/stats/components';
import { useStatsDashboard } from '../../src/features/stats/hooks/useStatsDashboard';
import { colors, spacing } from '../../src/shared/theme';
import { styles } from './styles';

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export default function ProfileScreen() {
  const {
    currentUser,
    avatarLetter,
    stats,
    summaryRows,
    recentSessions,
    handleLogout,
  } = useProfileScreen();

  const { data: streak } = useStreak();
  const { data: xp } = useUserXP();
  const { data: sessions = [] } = useFocusSessions();

  usePreferences();

  const {
    period,
    setPeriod,
    kpis,
    focusSeries,
    tasksSeries,
    subtasksSeries,
    monthlyCalendar,
    today,
    prevMonth,
    nextMonth,
    canGoNext,
    annualHeatmap,
    activeDays,
    bestDayData,
    weeklyChartData,
  } = useStatsDashboard();

  const activeDaysThisWeek = useMemo(() => {
    const now = new Date();
    const dow = now.getDay();
    const monOffset = dow === 0 ? 6 : dow - 1;
    return Array.from({ length: 7 }, (_, i) => {
      if (i > monOffset) return false;
      const d = new Date(now);
      d.setDate(now.getDate() - (monOffset - i));
      return sessions.some((s) => s.completed && isSameDay(new Date(s.startedAt), d));
    });
  }, [sessions]);

  const username = currentUser?.username ?? 'guest_user';
  const userId = currentUser?.id ?? 'unknown-id';

  const handleLogoutPress = () => {
    Alert.alert('Sign out', 'Do you want to close your current session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: handleLogout },
    ]);
  };

  return (
    <PageShell>
      <View style={styles.content}>
        <ProfileHeaderCard avatarLetter={avatarLetter} username={username} userId={userId} coins={xp?.coins ?? 0} />
        <ProfileLevelCard
          level={xp?.level ?? 1}
          xpInLevel={xp?.xpInLevel ?? 0}
          xpToNextLevel={xp?.xpToNextLevel ?? 200}
          progressPercent={xp?.progressPercent ?? 0}
          totalXp={xp?.totalXp ?? 0}
          coins={xp?.coins ?? 0}
        />
        <ProfileStatsRow stats={stats} />
        <ProfileAccountSummaryCard rows={summaryRows} />
        <ProfileRecentSessionsCard sessions={recentSessions} />
      </View>

      {/* Streak section */}
      <View style={{ marginTop: spacing.lg }}>
        <SectionLabel>STREAK</SectionLabel>
        <ProfileStreakCard
          currentStreak={streak?.currentStreak ?? 0}
          longestStreak={streak?.longestStreak ?? 0}
          activeDaysThisWeek={activeDaysThisWeek}
        />
      </View>

      {/* Stats section */}
      <View style={{ marginTop: spacing.lg }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: '900', marginBottom: spacing.xs }}>
          Statistics
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: 13, marginBottom: spacing.lg }}>
          Track your focus and productivity
        </Text>

        <TodayBanner today={today} />
        <PeriodSegmentedControl value={period} onChange={setPeriod} />

        <SectionLabel>OVERVIEW</SectionLabel>
        <StatsKpiGrid items={kpis} />

        <SectionLabel>CHARTS</SectionLabel>

        {period === 'weekly' && <RadialWeekChart data={weeklyChartData} />}

        {period === 'monthly' && (
          <MonthlyCalendarCard
            title={monthlyCalendar.title}
            weeks={monthlyCalendar.weeks}
            onPrev={prevMonth}
            onNext={nextMonth}
            canGoNext={canGoNext}
          />
        )}

        {period === 'annual' && (
          <>
            <AnnualCalendarHeatmap data={annualHeatmap} activeDays={activeDays} />
            <BestDayCard data={bestDayData} />
            <SectionLabel>MONTHLY BREAKDOWN</SectionLabel>
            <BarChartCard
              title="Focus Time"
              labels={focusSeries.labels}
              data={focusSeries.data}
              color={colors.secondary}
              yAxisSuffix="m"
            />
            <BarChartCard
              title="Tasks Done"
              labels={tasksSeries.labels}
              data={tasksSeries.data}
              color={colors.success}
            />
            <BarChartCard
              title="Subtasks Done"
              labels={subtasksSeries.labels}
              data={subtasksSeries.data}
              color="#F5A623"
            />
          </>
        )}
      </View>

      <View style={{ marginTop: spacing.lg }}>
        <ProfileLogoutButton onPress={handleLogoutPress} />
      </View>
    </PageShell>
  );
}
