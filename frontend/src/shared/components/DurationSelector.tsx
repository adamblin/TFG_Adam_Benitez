import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { colors, spacing } from '../theme';

interface DurationSelectorProps {
  durations: number[];
  selectedDuration: number;
  onSelect: (duration: number) => void;
}

export function DurationSelector({
  durations,
  selectedDuration,
  onSelect,
}: DurationSelectorProps) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
      {durations.map((duration) => (
        <TouchableOpacity
          key={duration}
          style={{
            flex: 1,
            minWidth: '22%',
            backgroundColor: selectedDuration === duration ? colors.primary : colors.surface,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: selectedDuration === duration ? colors.primary : colors.border,
            paddingVertical: spacing.md,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => onSelect(duration)}
        >
          <Text
            style={{
              color: selectedDuration === duration ? colors.background : colors.text,
              fontSize: 16,
              fontWeight: '700',
              letterSpacing: 0.5,
            }}
          >
            {duration}m
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
