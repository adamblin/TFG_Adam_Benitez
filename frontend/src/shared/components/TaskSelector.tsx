import React from 'react';
import { TouchableOpacity, View, Text, FlatList } from 'react-native';
import { colors, spacing } from '../theme';
import { Card } from './Card';

interface TaskItem {
  id: string;
  title: string;
}

interface TaskSelectorProps {
  tasks: TaskItem[];
  selectedTaskId: string | null;
  onSelect: (taskId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function TaskSelector({
  tasks,
  selectedTaskId,
  onSelect,
  isOpen,
  onToggle,
}: TaskSelectorProps) {
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <>
      <TouchableOpacity style={{}} onPress={onToggle}>
        <Card
          style={{
            marginBottom: spacing.lg,
            minHeight: 60,
            justifyContent: 'center',
          }}
        >
          {selectedTask ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: '900' }}>✓</Text>
              </View>
              <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700', flex: 1 }}>
                {selectedTask.title}
              </Text>
            </View>
          ) : (
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>Select a task to focus on...</Text>
          )}
        </Card>
      </TouchableOpacity>

      {isOpen && (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: spacing.lg,
            overflow: 'hidden',
          }}
        >
          {tasks.length === 0 ? (
            <Text style={{ color: colors.textMuted, fontSize: 14, padding: spacing.md, textAlign: 'center' }}>
              No tasks available. Create one first!
            </Text>
          ) : (
            tasks.map((task, index) => (
              <TouchableOpacity
                key={task.id}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderBottomWidth: index < tasks.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
                onPress={() => {
                  onSelect(task.id);
                  onToggle();
                }}
              >
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>
                  {task.title}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </>
  );
}
