import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import styles from './styles';
import { colors, spacing } from '../../src/shared/theme';
import { useTasks } from '../../src/features/tasks/hooks/useTasks';
import { useUpdateTask } from '../../src/features/tasks/hooks/useUpdateTask';
import { useCreateTask } from '../../src/features/tasks/hooks/useCreateTask';

export default function TasksScreen() {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const {
    data = [],
    isLoading,
    isError,
  } = useTasks();

  const {
    mutate: updateTask,
    isPending: isUpdating,
  } = useUpdateTask();

  const {
    mutate: createTask,
    isPending: isCreating,
  } = useCreateTask();

  const handleToggleDone = (task: (typeof data)[number]) => {
    if (task) {
      updateTask({ ...task, done: !task.done });
    }
  };

  const handleCreateTask = () => {
    const trimmedTitle = newTaskTitle.trim();
    if (trimmedTitle) {
      createTask(trimmedTitle);
      setNewTaskTitle('');
    } else {
      Alert.alert('Error', 'Please enter a title for the task');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.title}>Loading...</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.title}>Error</Text>
          <Text style={{ color: colors.error }}>No se pudieron cargar las tareas</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
      </View>

      <View style={styles.createForm}>
        <TextInput
          style={styles.input}
          placeholder="New task..."
          placeholderTextColor={colors.placeholderText}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          editable={!isCreating}
        />
        <TouchableOpacity
          style={[styles.createButton, (isCreating || !newTaskTitle.trim()) && styles.createButtonDisabled]}
          onPress={handleCreateTask}
          disabled={isCreating || !newTaskTitle.trim()}
        >
          {isCreating ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <Text style={styles.createButtonLabel}>+</Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: spacing.xl }}>
            <Text style={{ color: colors.textMuted }}>No hay tareas</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={[styles.itemTitle, item.done && styles.itemDone]}>
              {item.title}
            </Text>
            <TouchableOpacity
              style={[styles.itemAction, isUpdating && styles.itemActionDisabled]}
              onPress={() => handleToggleDone(item)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <Text style={styles.itemActionLabel}>{item.done ? 'Done' : 'Mark'}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
