import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, DatePicker } from '../../../shared/components';
import { colors } from '../../../shared/theme';
import { styles } from './TaskAccordionCard.styles';

export type TaskAccordionSubtask = {
  id: string;
  title: string;
  completed: boolean;
  badge?: string;
};

type TaskAccordionCardProps = {
  taskId: string;
  title: string;
  priorityLabel: string;
  dueDate: string | null;
  accentColor: string;
  subtasks: TaskAccordionSubtask[];
  defaultExpanded?: boolean;
  onFocusPress: () => void;
  onDeletePress: () => void;
  onDeleteSubtask: (subtaskId: string) => void;
  onToggleSubtask: (subtaskId: string, completed: boolean) => void;
  onDueDateChange?: (date: string | null) => void;
};

function formatDueChip(dueDate: string | null): { label: string; color: string } {
  if (!dueDate) return { label: '+ Due date', color: colors.textMuted };
  const dateOnly = dueDate.slice(0, 10);
  const due = new Date(`${dateOnly}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  if (diff < 0)  return { label: 'Overdue', color: colors.error };
  if (diff === 0) return { label: 'Today', color: colors.success };
  if (diff === 1) return { label: 'Tomorrow', color: colors.warning };
  if (diff <= 6)  return { label: `In ${diff} days`, color: colors.textMuted };
  return {
    label: due.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    color: colors.textMuted,
  };
}

export function TaskAccordionCard({
  taskId: _taskId,
  title,
  priorityLabel,
  dueDate,
  accentColor,
  subtasks,
  defaultExpanded = false,
  onFocusPress,
  onDeletePress,
  onDeleteSubtask,
  onToggleSubtask,
  onDueDateChange,
}: TaskAccordionCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [calOpen, setCalOpen]       = useState(false);

  const completedCount = useMemo(() => subtasks.filter((s) => s.completed).length, [subtasks]);
  const progressPercent = useMemo(() => {
    if (subtasks.length === 0) return 0;
    return Math.round((completedCount / subtasks.length) * 100);
  }, [completedCount, subtasks.length]);

  const priorityStyles = useMemo(
    () => ({ borderColor: accentColor, backgroundColor: `${accentColor}1A` }),
    [accentColor]
  );

  const due = formatDueChip(dueDate);

  const handleDueDateChange = (date: string | null) => {
    onDueDateChange?.(date);
    if (date) setCalOpen(false);
  };

  return (
    <Card style={[styles.card, { borderLeftColor: accentColor }]}>
      <View style={styles.header}>
        <Pressable style={styles.titleBlock} onPress={() => setIsExpanded((v) => !v)}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.priorityChip, priorityStyles]}>
              <View style={[styles.priorityDot, { backgroundColor: accentColor }]} />
              <Text style={[styles.priorityText, { color: accentColor }]}>{priorityLabel}</Text>
            </View>

            {/* Tappable due date chip */}
            <Pressable
              onPress={(e) => { e.stopPropagation?.(); setCalOpen((v) => !v); }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 99,
                backgroundColor: calOpen ? `${due.color}18` : 'transparent',
                borderWidth: 1,
                borderColor: calOpen ? due.color : 'transparent',
              }}
            >
              <Text style={{ fontSize: 11 }}>📅</Text>
              <Text style={{ color: due.color, fontSize: 12, fontWeight: dueDate ? '700' : '400' }}>
                {due.label}
              </Text>
            </Pressable>

            <Text style={styles.counterText}>{completedCount}/{subtasks.length}</Text>
          </View>
        </Pressable>

        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={onFocusPress}>
            <Text style={styles.actionText}>Focus</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onDeletePress}>
            <Text style={styles.actionText}>Delete</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => setIsExpanded((v) => !v)}>
            <Text style={styles.expandText}>{isExpanded ? 'v' : '>'}</Text>
          </Pressable>
        </View>
      </View>

      {/* Compact calendar box */}
      {calOpen && (
        <View style={{ marginHorizontal: 12, marginBottom: 8 }}>
          <View style={{
            width: 280,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#1c2538',
            overflow: 'hidden',
            backgroundColor: '#0d1320',
          }}>
            <DatePicker
              value={dueDate ? dueDate.slice(0, 10) : null}
              onChange={handleDueDateChange}
              accentColor={accentColor}
            />
          </View>
          {dueDate && (
            <Pressable
              onPress={() => handleDueDateChange(null)}
              style={{ paddingTop: 6, paddingLeft: 4 }}
            >
              <Text style={{ color: colors.error, fontSize: 12, fontWeight: '600' }}>
                Clear due date
              </Text>
            </Pressable>
          )}
        </View>
      )}

      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Progress</Text>
        <Text style={[styles.progressPercent, { color: accentColor }]}>{progressPercent}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: accentColor }]} />
      </View>

      {isExpanded && (
        <View style={styles.expanded}>
          {subtasks.map((item) => (
            <View key={item.id} style={styles.subtaskRow}>
              <Pressable
                style={styles.subtaskToggle}
                onPress={() => onToggleSubtask(item.id, !item.completed)}
              >
                <View style={[styles.subtaskCheckbox, item.completed && styles.subtaskCheckboxActive]}>
                  {item.completed ? <Text style={styles.subtaskCheck}>✓</Text> : null}
                </View>
                <Text style={[styles.subtaskTitle, item.completed && styles.subtaskTitleDone]}>
                  {item.title}
                </Text>
                {item.badge ? (
                  <View style={styles.subtaskBadge}>
                    <Text style={styles.subtaskBadgeText}>{item.badge}</Text>
                  </View>
                ) : null}
              </Pressable>
              <Pressable
                onPress={() => onDeleteSubtask(item.id)}
                hitSlop={8}
                style={styles.subtaskDeleteBtn}
              >
                <Text style={styles.subtaskDeleteText}>×</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}
