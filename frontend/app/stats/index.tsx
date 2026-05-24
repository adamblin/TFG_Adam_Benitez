import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageShell, SectionLabel } from '../../src/shared/components';
import { useTheme, spacing } from '../../src/shared/theme';
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

export default function StatsScreen() {
  const colors = useTheme();
  const {
    isLoading,
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

  if (isLoading) {
    return (
      <PageShell>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 60 }} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: spacing.lg }}>
        <View>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 2 }}>
            Your progress
          </Text>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', lineHeight: 32 }}>
            Statistics
          </Text>
        </View>
        <View style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: `${colors.focusSession}20`,
          borderWidth: 1,
          borderColor: `${colors.focusSession}40`,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="bar-chart" size={20} color={colors.focusSession} />
        </View>
      </View>

      <TodayBanner today={today} />

      <PeriodSegmentedControl value={period} onChange={setPeriod} />

      <SectionLabel>OVERVIEW</SectionLabel>
      <StatsKpiGrid items={kpis} />

      <SectionLabel>CHARTS</SectionLabel>

      {period === 'weekly' && (
        <RadialWeekChart data={weeklyChartData} />
      )}

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
            color={colors.focusSession}
            yAxisSuffix="m"
          />
          <BarChartCard
            title="Tasks Done"
            labels={tasksSeries.labels}
            data={tasksSeries.data}
            color={colors.task}
          />
          <BarChartCard
            title="Subtasks Done"
            labels={subtasksSeries.labels}
            data={subtasksSeries.data}
            color={colors.subtask}
          />
        </>
      )}
    </PageShell>
  );
}
