import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, spacing } from '../../src/shared/theme';
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
  const colors = useTheme();
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
  const completedSubtasks = priorityTask
    ? priorityTask.subtasks.filter((s) => s.completed).length
    : 0;
  const totalSubtasks = priorityTask?.subtasks.length ?? 0;
  const subtaskPercent = totalSubtasks > 0
    ? Math.round((completedSubtasks / totalSubtasks) * 100)
    : 0;

  return (
    <PageShell>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg }}>
        <View style={{ flex: 1, paddingRight: spacing.md }}>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 2 }}>
            {getGreeting()},
          </Text>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', lineHeight: 32 }}>
            {username}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            borderWidth: 2,
            borderColor: `${colors.primary}60`,
            backgroundColor: `${colors.primary}20`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '900' }}>{avatarLetter}</Text>
        </TouchableOpacity>
      </View>

      {/* Daily progress */}
      <ProgressCard percent={progressPercent} completed={completedTasks} total={totalTasks} />

      {/* Stat row */}
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg }}>
        <StatCard
          value={totalTasks}
          label="Tasks"
          icon="checkmark-circle"
          accentColor={colors.task}
        />
        <StatCard
          value={completedTasks}
          label="Done"
          icon="checkmark-done"
          accentColor={colors.subtask}
        />
        <StatCard
          value={streakValue}
          label="Streak"
          icon="flame"
          accentColor={colors.warning}
        />
      </View>

      {/* Quick actions */}
      <SectionLabel>QUICK ACTIONS</SectionLabel>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: spacing.lg, rowGap: spacing.sm }}>
        <ActionCard
          title="New Task"
          subtitle="Break it down with AI"
          onPress={() => router.push('/tasks')}
          icon="add-circle"
          accentColor={colors.task}
        />
        <ActionCard
          title="Focus Mode"
          subtitle="Start the timer"
          onPress={() => router.push('/focus')}
          icon="timer"
          accentColor={colors.focusSession}
        />
        <ActionCard
          title="Safe Mode"
          subtitle="Show only essentials"
          onPress={() => router.push('/stuck')}
          icon="shield-half"
          accentColor="#3B82F6"
        />
        <ActionCard
          title="Week"
          subtitle="Load overview"
          onPress={() => router.push('/stats')}
          icon="calendar"
          accentColor={colors.subtask}
        />
      </View>

      {/* Priority task */}
      {priorityTask && (
        <>
          <SectionLabel>PRIORITY NOW</SectionLabel>
          <View style={{
            borderRadius: 20,
            borderWidth: 1,
            borderColor: `${colors.task}45`,
            borderTopColor: `${colors.task}85`,
            backgroundColor: colors.surface,
            overflow: 'hidden',
            marginBottom: spacing.lg,
          }}>
            {/* Task color sheen */}
            <LinearGradient
              colors={[`${colors.task}14`, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80 }}
              pointerEvents="none"
            />

            <View style={{ padding: spacing.md }}>
              {/* Label */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm }}>
                <Ionicons name="flag" size={13} color={colors.task} />
                <Text style={{ color: colors.task, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 }}>
                  NEXT UP
                </Text>
              </View>

              {/* Task title */}
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: '800', lineHeight: 26, marginBottom: spacing.sm }}>
                {priorityTask.title}
              </Text>

              {/* Subtask row */}
              {totalSubtasks > 0 ? (
                <View style={{ gap: spacing.xs }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Ionicons name="list" size={14} color={colors.subtask} />
                      <Text style={{ color: colors.subtask, fontSize: 12, fontWeight: '700' }}>
                        Subtasks
                      </Text>
                    </View>
                    <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                      {completedSubtasks}/{totalSubtasks} done
                    </Text>
                  </View>
                  {/* Subtask progress bar */}
                  <View style={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: `${colors.subtask}22`,
                    overflow: 'hidden',
                  }}>
                    <LinearGradient
                      colors={[colors.subtask, colors.focusSession]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ width: `${Math.max(2, subtaskPercent)}%`, height: '100%', borderRadius: 3 }}
                    />
                  </View>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="timer-outline" size={14} color={colors.focusSession} />
                  <Text style={{ color: colors.textMuted, fontSize: 12 }}>
                    Focus this task right now
                  </Text>
                </View>
              )}
            </View>
          </View>
        </>
      )}
    </PageShell>
  );
}
