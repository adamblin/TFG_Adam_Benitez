import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, spacing } from '../theme';
import { Card } from './Card';

interface DecomposeFormProps {
  taskTitle: string;
  onTaskTitleChange: (title: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function DecomposeForm({
  taskTitle,
  onTaskTitleChange,
  onSubmit,
  isLoading = false,
}: DecomposeFormProps) {
  return (
    <Card>
      <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: spacing.xs }}>
        Priority
      </Text>
      <TextInput
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          fontSize: 14,
          marginBottom: spacing.md,
        }}
        placeholder="Today"
        placeholderTextColor={colors.placeholderText}
      />

      <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: spacing.xs }}>
        Create partial task
      </Text>
      <TextInput
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          fontSize: 14,
          marginBottom: spacing.md,
        }}
        placeholder="Type your task..."
        placeholderTextColor={colors.placeholderText}
        value={taskTitle}
        onChangeText={onTaskTitleChange}
        editable={!isLoading}
      />

      <Text style={{ color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: spacing.xs }}>
        Comment
      </Text>
      <TextInput
        style={{
          backgroundColor: colors.background,
          color: colors.text,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          fontSize: 14,
          marginBottom: spacing.md,
        }}
        placeholder="Extra info (YYYY-MM-DD)"
        placeholderTextColor={colors.placeholderText}
      />

      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          borderRadius: 10,
          paddingVertical: spacing.md,
          alignItems: 'center',
          opacity: isLoading || !taskTitle.trim() ? 0.6 : 1,
        }}
        onPress={onSubmit}
        disabled={isLoading || !taskTitle.trim()}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>+ Decompose</Text>
        )}
      </TouchableOpacity>
    </Card>
  );
}
