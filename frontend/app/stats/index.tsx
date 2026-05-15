import React from 'react';
import { Text } from 'react-native';
import { PageShell, SectionLabel } from '../../src/shared/components';
import { colors, spacing } from '../../src/shared/theme';
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
import { styles } from './styles';

export default function StatsScreen() {
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

  return (
    <PageShell>
      <Text style={styles.title}>Statistics</Text>
      <Text style={{ color: colors.textMuted, fontSize: 15, marginBottom: spacing.lg }}>
        Track your focus and productivity
      </Text>

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
            color={colors.primary}
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
    </PageShell>
  );
}
