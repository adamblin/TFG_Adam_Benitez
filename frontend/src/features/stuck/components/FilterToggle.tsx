import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, spacing } from '../../../shared/theme';

type Props = {
  showAll: boolean;
  onToggle: (all: boolean) => void;
};

export function FilterToggle({ showAll, onToggle }: Props) {
  const colors = useTheme();

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 4,
      marginBottom: spacing.md,
      gap: 4,
    }}>
      <TouchableOpacity
        onPress={() => onToggle(false)}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          paddingVertical: 10,
          borderRadius: 11,
          backgroundColor: !showAll ? '#3B82F6' : 'transparent',
        }}
        activeOpacity={0.75}
      >
        <Ionicons
          name="shield-half"
          size={15}
          color={!showAll ? '#fff' : colors.textMuted}
        />
        <Text style={{
          color: !showAll ? '#fff' : colors.textMuted,
          fontSize: 13,
          fontWeight: '700',
        }}>
          Safe Mode
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onToggle(true)}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          paddingVertical: 10,
          borderRadius: 11,
          backgroundColor: showAll ? `${colors.primary}25` : 'transparent',
        }}
        activeOpacity={0.75}
      >
        <Ionicons
          name="eye"
          size={15}
          color={showAll ? colors.primary : colors.textMuted}
        />
        <Text style={{
          color: showAll ? colors.primary : colors.textMuted,
          fontSize: 13,
          fontWeight: '700',
        }}>
          All
        </Text>
      </TouchableOpacity>
    </View>
  );
}
