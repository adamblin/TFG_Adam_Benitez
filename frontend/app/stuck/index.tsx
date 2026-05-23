import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageShell, Card, SectionLabel } from '../../src/shared/components';
import { useTheme, spacing } from '../../src/shared/theme';
import { useStuckScreen } from '../../src/features/stuck/hooks/useStuckScreen';
import { StressCard } from '../../src/features/stuck/components/StressCard';
import { FilterToggle } from '../../src/features/stuck/components/FilterToggle';
import { StuckTaskItem } from '../../src/features/stuck/components/StuckTaskItem';
import { StuckTaskCard } from '../../src/features/stuck/components/StuckTaskCard';
import { useAuthStore } from '../../src/store/auth.store';

export default function StuckScreen() {
  const colors      = useTheme();
  const router      = useRouter();
  const avatarLetter = (useAuthStore((s) => s.currentUser?.username?.charAt(0) ?? 'U')).toUpperCase();

  const {
    isLoading,
    stress,
    showAll,
    setShowAll,
    visibleTasks,
    totalPending,
  } = useStuckScreen();

  // Which saturat card is expanded (0 = first by default); tap to toggle
  const [expandedIdx, setExpandedIdx] = useState(0);

  return (
    <PageShell>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.textMuted, fontSize: 13, fontWeight: '600', marginBottom: 2 }}>
            When everything feels too much
          </Text>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '900', lineHeight: 32 }}>
            Safe Mode
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

      {isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.lg }} />
      ) : (
        <>
          <StressCard stress={stress} barColor="#3B82F6" />

          <FilterToggle showAll={showAll} onToggle={setShowAll} />

          <SectionLabel style={{ marginTop: 0 }}>
            {showAll ? `ALL TASKS (${totalPending})` : 'TOP 3 ESSENTIAL TASKS'}
          </SectionLabel>

          {visibleTasks.length === 0 ? (
            <Card>
              <View style={{ alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.sm }}>
                <Ionicons name="checkmark-circle" size={40} color={colors.riskLow} />
                <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', textAlign: 'center' }}>
                  {showAll ? 'No pending tasks!' : 'No urgent tasks right now'}
                </Text>
                <Text style={{ color: colors.textMuted, fontSize: 13, textAlign: 'center' }}>
                  {showAll ? 'Great work, keep it up.' : 'Switch to "All" to see every task.'}
                </Text>
              </View>
            </Card>
          ) : showAll ? (
            /* Tot mode — simple list rows */
            <Card style={{ paddingVertical: 0, paddingHorizontal: spacing.md }}>
              {visibleTasks.map((task, i) => (
                <StuckTaskItem
                  key={task.id}
                  task={task}
                  isLast={i === visibleTasks.length - 1}
                  showSubtask={false}
                  onPress={() => router.push(`/tasks?taskId=${task.id}`)}
                />
              ))}
            </Card>
          ) : (
            /* Saturat mode — rich expandable cards */
            <View>
              {visibleTasks.map((task, i) => (
                <StuckTaskCard
                  key={task.id}
                  task={task}
                  rank={i + 1}
                  isExpanded={expandedIdx === i}
                  onPress={() => setExpandedIdx(expandedIdx === i ? -1 : i)}
                  onFocusPress={() => router.push(`/focus?origin=stuck&taskId=${task.id}`)}
                />
              ))}
            </View>
          )}
        </>
      )}
    </PageShell>
  );
}
