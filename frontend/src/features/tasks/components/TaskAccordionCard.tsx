import React, { useMemo, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, DatePicker } from '../../../shared/components';
import { useTheme } from '../../../shared/theme';
import type { ColorPalette } from '../../../shared/theme';
import { makeStyles } from './TaskAccordionCard.styles';

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
  onUpdateTitle?: (title: string) => void;
  onUpdateSubtask?: (subtaskId: string, title: string) => void;
};

function formatDueChip(dueDate: string | null, colors: ColorPalette): { label: string; color: string } {
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
  onUpdateTitle,
  onUpdateSubtask,
}: TaskAccordionCardProps) {
  const colors = useTheme();
  const styles = makeStyles(colors);
  const [isExpanded, setIsExpanded]       = useState(defaultExpanded);
  const [calOpen, setCalOpen]             = useState(false);
  const [editingTitle, setEditingTitle]   = useState(false);
  const [titleDraft, setTitleDraft]       = useState(title);
  const [editingSubId, setEditingSubId]   = useState<string | null>(null);
  const [subDraft, setSubDraft]           = useState('');
  const titleInputRef                     = useRef<TextInput>(null);

  const commitTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== title) onUpdateTitle?.(trimmed);
    else setTitleDraft(title);
    setEditingTitle(false);
  };

  const startEditSub = (sub: TaskAccordionSubtask) => {
    setEditingSubId(sub.id);
    setSubDraft(sub.title);
  };

  const commitSub = (subtaskId: string, original: string) => {
    const trimmed = subDraft.trim();
    if (trimmed && trimmed !== original) onUpdateSubtask?.(subtaskId, trimmed);
    else setSubDraft(original);
    setEditingSubId(null);
  };

  const completedCount = useMemo(() => subtasks.filter((s) => s.completed).length, [subtasks]);
  const progressPercent = useMemo(() => {
    if (subtasks.length === 0) return 0;
    return Math.round((completedCount / subtasks.length) * 100);
  }, [completedCount, subtasks.length]);

  const priorityStyles = useMemo(
    () => ({ borderColor: accentColor, backgroundColor: `${accentColor}1A` }),
    [accentColor]
  );

  const due = formatDueChip(dueDate, colors);

  const handleDueDateChange = (date: string | null) => {
    onDueDateChange?.(date);
    if (date) setCalOpen(false);
  };

  return (
    <Card style={[styles.card, { borderLeftColor: accentColor }]}>
      <View style={styles.header}>
        <Pressable style={styles.titleBlock} onPress={() => !editingTitle && setIsExpanded((v) => !v)}>
          {editingTitle ? (
            <TextInput
              ref={titleInputRef}
              value={titleDraft}
              onChangeText={setTitleDraft}
              onBlur={commitTitle}
              onSubmitEditing={commitTitle}
              autoFocus
              returnKeyType="done"
              style={[styles.title, {
                borderBottomWidth: 1,
                borderBottomColor: accentColor,
                paddingVertical: 2,
                color: colors.text,
              }]}
            />
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}
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
            <Ionicons name="timer-outline" size={20} color={colors.focusSession} />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => { setTitleDraft(title); setEditingTitle(true); }}
          >
            <Ionicons name="pencil-outline" size={18} color={colors.textMuted} />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={onDeletePress}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => setIsExpanded((v) => !v)}>
            <Ionicons
              name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={20}
              color={colors.textMuted}
            />
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
                onPress={() => editingSubId !== item.id && onToggleSubtask(item.id, !item.completed)}
              >
                <View style={[styles.subtaskCheckbox, item.completed && styles.subtaskCheckboxActive]}>
                  {item.completed ? <Text style={styles.subtaskCheck}>✓</Text> : null}
                </View>

                {editingSubId === item.id ? (
                  <TextInput
                    value={subDraft}
                    onChangeText={setSubDraft}
                    onBlur={() => commitSub(item.id, item.title)}
                    onSubmitEditing={() => commitSub(item.id, item.title)}
                    autoFocus
                    returnKeyType="done"
                    style={[styles.subtaskTitle, {
                      flex: 1,
                      borderBottomWidth: 1,
                      borderBottomColor: accentColor,
                      paddingVertical: 1,
                      color: colors.text,
                    }]}
                  />
                ) : (
                  <Text style={[styles.subtaskTitle, item.completed && styles.subtaskTitleDone]}>
                    {item.title}
                  </Text>
                )}

                {item.badge && editingSubId !== item.id ? (
                  <View style={styles.subtaskBadge}>
                    <Text style={styles.subtaskBadgeText}>{item.badge}</Text>
                  </View>
                ) : null}
              </Pressable>

              <Pressable
                onPress={() => startEditSub(item)}
                hitSlop={8}
                style={styles.subtaskDeleteBtn}
              >
                <Ionicons name="pencil-outline" size={13} color={colors.textMuted} />
              </Pressable>
              <Pressable
                onPress={() => onDeleteSubtask(item.id)}
                hitSlop={8}
                style={styles.subtaskDeleteBtn}
              >
                <Ionicons name="close" size={14} color={colors.error} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}
