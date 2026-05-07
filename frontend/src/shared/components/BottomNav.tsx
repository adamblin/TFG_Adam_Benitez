import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing } from '../theme';

export interface BottomNavItem {
  label: string;
  route?: string;
}

export interface BottomNavProps {
  items?: BottomNavItem[];
}

export function BottomNav({
  items = [
    { label: 'Home', route: '/home' },
    { label: 'Tasks', route: '/tasks' },
    { label: 'Focus', route: '/focus' },
    { label: 'Profile', route: '/profile' },
  ],
}: BottomNavProps) {
  const router = useRouter();

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        paddingBottom: spacing.md,
        flexDirection: 'row',
        gap: spacing.sm,
      }}
    >
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: colors.border,
            paddingVertical: spacing.sm,
            alignItems: 'center',
          }}
          onPress={() => item.route && router.push(item.route)}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 12,
              fontWeight: '700',
            }}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
