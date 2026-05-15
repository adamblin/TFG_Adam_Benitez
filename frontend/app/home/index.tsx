import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
import { useStreak } from '../../src/features/streaks/hooks/useStreak';
import { useAuthStore } from '../../src/store/auth.store';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const { data: tasks = [] } = useTasks();
  const { data: streak } = useStreak();
  const currentUser = useAuthStore((state) => state.currentUser);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const username = currentUser?.username ?? 'there';
  const avatarLetter = (currentUser?.username?.charAt(0) ?? 'U').toUpperCase();
  const streakValue = `${streak?.currentStreak ?? 0}d`;

  const priorityTask = tasks.find((t) => !t.completed) ?? null;

  return (
    <PageShell>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
        <View style={{ flex: 1, paddingRight: spacing.md }}>
          <Text style={{ color: colors.text, fontSize: 34, fontWeight: '900', marginBottom: spacing.xs }}>
            {getGreeting()}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 15, marginBottom: spacing.sm }}>
            A good day to move your goals forward
          </Text>
          <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700' }}>{username}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '900' }}>{avatarLetter}</Text>
        </TouchableOpacity>
      </View>

      <ProgressCard percent={progressPercent} completed={completedTasks} total={totalTasks} />

      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
        <StatCard value={totalTasks} label="Tasks" />
        <StatCard value={completedTasks} label="Done" />
        <StatCard value={streakValue} label="Streak" />
      </View>

      <SectionLabel>QUICK ACTIONS</SectionLabel>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.lg, rowGap: spacing.sm }}>
        <ActionCard title="New Task" subtitle="Break it down with AI" onPress={() => router.push('/tasks')} />
        <ActionCard title="Focus Mode" subtitle="Start the timer" onPress={() => router.push('/focus')} />
        <ActionCard title="I feel stuck" subtitle="Show only essentials" onPress={() => router.push('/tasks')} />
        <ActionCard title="Week" subtitle="Load overview" onPress={() => router.push('/tasks')} />
      </View>

      {priorityTask && (
        <>
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
            <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', lineHeight: 34, marginBottom: spacing.sm }}>
              {priorityTask.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
              <View
                style={{
                  backgroundColor: colors.text,
                  borderRadius: 999,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ color: colors.background, fontSize: 11, fontWeight: '700' }}>Priority</Text>
              </View>
              <Text style={{ color: colors.textMuted, fontSize: 13, flex: 1 }}>
                {priorityTask.subtasks.length > 0
                  ? `${priorityTask.subtasks.filter((s) => s.completed).length}/${priorityTask.subtasks.length} subtasks done`
                  : 'Focus this task right now'}
              </Text>
            </View>
            {priorityTask.subtasks.length > 0 && (
              <View
                style={{
                  height: 10,
                  borderRadius: 999,
                  backgroundColor: colors.background,
                  borderWidth: 1,
                  borderColor: colors.border,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${Math.round((priorityTask.subtasks.filter((s) => s.completed).length / priorityTask.subtasks.length) * 100)}%`,
                    height: '100%',
                    borderRadius: 999,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            )}
          </View>
        </>
      )}
    </PageShell>
  );
}
