import React, { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Button, Card, DatePicker } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import { styles } from './TaskComposerCard.styles';

type Mode = 'auto' | 'manual';
type SubtaskDraft = { key: string; title: string };

function formatSelected(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff > 1 && diff <= 6) return `In ${diff} days`;
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

type Props = {
  onAutoSubmit: (title: string, dueDate: string | null) => void | Promise<void>;
  onManualSubmit: (title: string, subtasks: string[], dueDate: string | null) => void | Promise<void>;
  isLoading?: boolean;
};

export function TaskComposerCard({ onAutoSubmit, onManualSubmit, isLoading = false }: Props) {
  const [mode, setMode]             = useState<Mode>('auto');
  const [autoTitle, setAutoTitle]   = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [subtaskDrafts, setSubtaskDrafts] = useState<SubtaskDraft[]>([]);
  const [dueDate, setDueDate]       = useState<string | null>(null);
  const [calOpen, setCalOpen]       = useState(false);
  const counter = useRef(0);

  const addSubtask = () => {
    counter.current += 1;
    setSubtaskDrafts((prev) => [...prev, { key: String(counter.current), title: '' }]);
  };
  const removeSubtask = (key: string) =>
    setSubtaskDrafts((prev) => prev.filter((s) => s.key !== key));
  const updateSubtask = (key: string, title: string) =>
    setSubtaskDrafts((prev) => prev.map((s) => (s.key === key ? { ...s, title } : s)));

  const resetForm = () => {
    setDueDate(null);
    setCalOpen(false);
  };

  const handleAutoSubmit = () => {
    const t = autoTitle.trim();
    if (!t) return;
    onAutoSubmit(t, dueDate);
    setAutoTitle('');
    resetForm();
  };

  const handleManualSubmit = () => {
    const t = manualTitle.trim();
    if (!t) return;
    const validSubtasks = subtaskDrafts.map((s) => s.title.trim()).filter(Boolean);
    onManualSubmit(t, validSubtasks, dueDate);
    setManualTitle('');
    setSubtaskDrafts([]);
    resetForm();
  };

  const dueDateRow = (
    <View style={{ marginBottom: spacing.sm }}>
      {/* Toggle button */}
      <Pressable
        onPress={() => setCalOpen((v) => !v)}
        disabled={isLoading}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.sm,
          borderRadius: 8,
          backgroundColor: calOpen ? `${colors.primary}14` : 'transparent',
          borderWidth: 1,
          borderColor: dueDate ? colors.primary : colors.border,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ fontSize: 14 }}>📅</Text>
        <Text style={{
          fontSize: 13,
          fontWeight: dueDate ? '700' : '400',
          color: dueDate ? colors.primary : colors.textMuted,
        }}>
          {dueDate ? formatSelected(dueDate) : 'Add due date'}
        </Text>
        {dueDate && (
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); setDueDate(null); setCalOpen(false); }}
            hitSlop={8}
          >
            <Text style={{ color: colors.textMuted, fontSize: 16, lineHeight: 18 }}>×</Text>
          </Pressable>
        )}
      </Pressable>

      {/* Compact calendar box */}
      {calOpen && (
        <View style={{
          marginTop: spacing.xs,
          width: 280,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#1c2538',
          overflow: 'hidden',
          backgroundColor: '#0d1320',
        }}>
          <DatePicker
            value={dueDate}
            onChange={(d) => { setDueDate(d); if (d) setCalOpen(false); }}
            accentColor={colors.primary}
          />
        </View>
      )}
    </View>
  );

  return (
    <Card style={styles.card}>
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tab, mode === 'auto' && styles.tabActive]}
          onPress={() => setMode('auto')}
        >
          <Text style={[styles.tabText, mode === 'auto' && styles.tabTextActive]}>Auto</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, mode === 'manual' && styles.tabActive]}
          onPress={() => setMode('manual')}
        >
          <Text style={[styles.tabText, mode === 'manual' && styles.tabTextActive]}>Manual</Text>
        </Pressable>
      </View>

      {mode === 'auto' ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Describe the task you want to break down..."
            placeholderTextColor={colors.textMuted}
            value={autoTitle}
            onChangeText={setAutoTitle}
            editable={!isLoading}
            multiline
            textAlignVertical="top"
          />
          {dueDateRow}
          <Text style={styles.helperText}>AI will break it into subtasks automatically</Text>
          <Button
            label="Break down"
            onPress={handleAutoSubmit}
            disabled={isLoading || !autoTitle.trim()}
            style={styles.button}
          />
        </>
      ) : (
        <>
          <TextInput
            style={[styles.input, styles.titleInput]}
            placeholder="Task title..."
            placeholderTextColor={colors.textMuted}
            value={manualTitle}
            onChangeText={setManualTitle}
            editable={!isLoading}
          />
          {dueDateRow}
          <View style={styles.subtaskSection}>
            <Text style={styles.subtaskSectionLabel}>Subtasks</Text>
            {subtaskDrafts.map((s) => (
              <View key={s.key} style={styles.subtaskRow}>
                <View style={styles.subtaskBullet} />
                <TextInput
                  style={styles.subtaskInput}
                  placeholder="Subtask title..."
                  placeholderTextColor={colors.textMuted}
                  value={s.title}
                  onChangeText={(v) => updateSubtask(s.key, v)}
                  editable={!isLoading}
                />
                <Pressable onPress={() => removeSubtask(s.key)} hitSlop={8} style={styles.removeBtn}>
                  <Text style={styles.removeBtnText}>×</Text>
                </Pressable>
              </View>
            ))}
            <Pressable style={styles.addSubtaskRow} onPress={addSubtask} disabled={isLoading}>
              <Text style={styles.addSubtaskText}>+ Add subtask</Text>
            </Pressable>
          </View>
          <Button
            label="Save task"
            onPress={handleManualSubmit}
            disabled={isLoading || !manualTitle.trim()}
            style={styles.button}
          />
        </>
      )}
    </Card>
  );
}
