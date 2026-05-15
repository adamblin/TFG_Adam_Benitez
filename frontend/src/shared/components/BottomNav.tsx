import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors, spacing } from '../theme';
import { useThemeStore } from '../../store/theme.store';

export interface BottomNavItem {
  label: string;
  route?: string;
}

export interface BottomNavProps {
  items?: BottomNavItem[];
}

const DEFAULT_ITEMS: BottomNavItem[] = [
  { label: 'Home', route: '/home' },
  { label: 'Tasks', route: '/tasks' },
  { label: 'Focus', route: '/focus' },
  { label: 'Shop', route: '/shop' },
  { label: 'Profile', route: '/profile' },
];

export function BottomNav({ items = DEFAULT_ITEMS }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const primaryColor = useThemeStore((s) => s.primaryColor);

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: spacing.sm,
        paddingTop: spacing.sm,
        paddingBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      {items.map((item) => {
        const isActive = item.route
          ? pathname === item.route || pathname.startsWith(item.route + '/')
          : false;

        return (
          <TouchableOpacity
            key={item.route ?? item.label}
            onPress={() => item.route && router.push(item.route)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingTop: spacing.md,
              paddingBottom: spacing.xs,
            }}
          >
            {isActive && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 20,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: primaryColor,
                }}
              />
            )}
            <Text
              style={{
                color: isActive ? primaryColor : colors.textMuted,
                fontSize: 11,
                fontWeight: isActive ? '800' : '500',
                textAlign: 'center',
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
