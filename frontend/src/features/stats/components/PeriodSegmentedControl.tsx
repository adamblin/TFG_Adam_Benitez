import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { StatsPeriod } from '../hooks/useStatsDashboard';
import { styles } from './PeriodSegmentedControl.styles';

interface PeriodSegmentedControlProps {
  value: StatsPeriod;
  onChange: (next: StatsPeriod) => void;
}

const options: Array<{ key: StatsPeriod; label: string }> = [
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'annual', label: 'Annual' },
];

export function PeriodSegmentedControl({ value, onChange }: PeriodSegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = value === option.key;

        return (
          <TouchableOpacity
            key={option.key}
            onPress={() => onChange(option.key)}
            style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
          >
            <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
