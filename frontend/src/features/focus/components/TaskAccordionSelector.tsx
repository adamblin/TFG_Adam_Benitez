import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { colors, spacing } from '../../../shared/theme';
import { computeRisk, RISK_CONFIG } from '../../../shared/utils/taskRisk';
import { styles } from './TaskAccordionSelector.styles';

export type TaskWithSubtasks = {
  id: string;
  title: string;
  completed?: boolean;
  dueDate?: string | null;
  subtasks: Array<{ id: string; title: string; completed: boolean }>;
};

type Props = {
  tasks: TaskWithSubtasks[];
  selectedTaskId: string | null;
  selectedSubtaskId: string | null;
  onSelectTask: (taskId: string) => void;
  onSelectSubtask: (subtaskId: string, taskId: string) => void;
};

export function TaskAccordionSelector({
  tasks,
  selectedTaskId,
  selectedSubtaskId,
  onSelectTask,
  onSelectSubtask,
}: Props) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(selectedTaskId);

  const handleSelectTask = (taskId: string) => {
    onSelectTask(taskId);
    setExpandedTaskId(taskId);
  };

  return (
    <View>
      {tasks.map((task) => {
        const isExpanded  = expandedTaskId === task.id;
        const isSelected  = selectedTaskId === task.id;
        const risk        = computeRisk(task);
        const { label: riskLabel, color: riskColor } = RISK_CONFIG[risk];

        return (
          <View key={task.id} style={{ marginBottom: spacing.sm }}>
            <Pressable
              onPress={() => {
                handleSelectTask(task.id);
                setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
              }}
            >
              <Card
                style={[
                  styles.taskCard,
                  {
                    borderLeftColor: riskColor,
                    backgroundColor: isSelected ? `${riskColor}22` : colors.surface,
                  },
                ]}
              >
                <View style={styles.taskHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.taskTitle, { color: colors.text }]}>
                      {task.title}
                    </Text>
                    <View style={styles.taskMeta}>
                      {/* Risk chip — same style as TaskAccordionCard */}
                      <View style={[
                        styles.priorityChip,
                        { backgroundColor: `${riskColor}1A`, borderColor: riskColor, borderWidth: 1 },
                      ]}>
                        <View style={[styles.priorityDot, { backgroundColor: riskColor }]} />
                        <Text style={[styles.priorityText, { color: riskColor }]}>
                          {riskLabel}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[
                    styles.expandIcon,
                    {
                      color: isSelected ? riskColor : colors.textMuted,
                      transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                    },
                  ]}>
                    ›
                  </Text>
                </View>
              </Card>
            </Pressable>

            {isExpanded && task.subtasks.length > 0 && (
              <View style={styles.subtasksContainer}>
                {task.subtasks.map((subtask, index) => {
                  const isSubtaskSelected = selectedSubtaskId === subtask.id;
                  return (
                    <Pressable
                      key={subtask.id}
                      onPress={() => onSelectSubtask(subtask.id, task.id)}
                      style={{ marginBottom: index < task.subtasks.length - 1 ? spacing.xs : 0 }}
                    >
                      <Card style={[
                        styles.subtaskCard,
                        {
                          backgroundColor: isSubtaskSelected
                            ? `${riskColor}22`
                            : colors.background,
                          borderLeftWidth: isSubtaskSelected ? 2 : 0,
                          borderLeftColor: riskColor,
                        },
                      ]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={[
                            styles.subtaskTitle,
                            {
                              color: subtask.completed ? colors.textMuted : colors.text,
                              textDecorationLine: subtask.completed ? 'line-through' : 'none',
                            },
                          ]}>
                            {subtask.title}
                          </Text>
                          {isSubtaskSelected && (
                            <Text style={[styles.subtaskCheckmark, { color: riskColor }]}>✓</Text>
                          )}
                        </View>
                      </Card>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
