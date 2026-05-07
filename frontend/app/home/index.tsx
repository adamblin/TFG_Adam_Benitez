import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../../src/shared/theme';
import {
  PageShell,
  ProgressCard,
  ActionCard,
  StatCard,
  SectionLabel,
} from '../../src/shared/components';
import { useTasks } from '../../src/features/tasks/hooks/useTasks';

export default function HomeScreen() {
  const router = useRouter();
  const { data: tasks = [] } = useTasks();

  const completedTasks = tasks.filter((task) => task.done).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <PageShell>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
        <View style={{ flex: 1, paddingRight: spacing.md }}>
          <Text style={{ color: colors.text, fontSize: 34, fontWeight: '900', marginBottom: spacing.xs }}>
            Good Morning
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 15, marginBottom: spacing.sm }}>
            A good day to move your goals forward
          </Text>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>test_user</Text>
        </View>
        <View
          style={{
            minWidth: 46,
            height: 46,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '900' }}>5d</Text>
        </View>
      </View>

      <ProgressCard percent={progressPercent} completed={completedTasks} total={totalTasks} />

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
        <StatCard value={totalTasks} label="Tasks" />
        <StatCard value={completedTasks} label="Done" />
        <StatCard value="5d" label="Streak" />
      </View>

      <SectionLabel>QUICK ACTIONS</SectionLabel>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.lg, rowGap: spacing.sm }}>
        <ActionCard title="New Task" subtitle="Break it down with AI" onPress={() => router.push('/tasks')} />
        <ActionCard title="Focus Mode" subtitle="Start the timer" onPress={() => router.push('/focus')} />
        <ActionCard title="I feel stuck" subtitle="Show only essentials" onPress={() => router.push('/tasks')} />
        <ActionCard title="Week" subtitle="Load overview" onPress={() => router.push('/tasks')} />
      </View>

      <SectionLabel>PRIORITY NOW</SectionLabel>
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.md,
          marginBottom: spacing.lg,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 36, fontWeight: '900', lineHeight: 40, marginBottom: spacing.sm }}>
          Prepare frontend demo
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
          <View
            style={{
              color: colors.background,
              backgroundColor: colors.text,
              borderRadius: 999,
              paddingHorizontal: spacing.sm,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: colors.background, fontSize: 11, fontWeight: '700' }}>Today</Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 13, flex: 1 }}>Focus this task right now</Text>
        </View>
        <View
          style={{
            height: 10,
            borderRadius: 999,
            backgroundColor: '#0d162a',
            borderWidth: 1,
            borderColor: colors.border,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              width: '30%',
              height: '100%',
              borderRadius: 999,
              backgroundColor: colors.primary,
            }}
          />
        </View>
      </View>
    </PageShell>
  );
}
