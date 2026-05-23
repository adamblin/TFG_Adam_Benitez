import React from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { spacing } from '../theme/colors';
import { useTheme } from '../theme';
import { useFocusSessionStore } from '../../store/focus-session.store';

export interface BottomNavItem {
  label: string;
  route?: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
}

export interface BottomNavProps {
  items?: BottomNavItem[];
  orientation?: 'horizontal' | 'vertical';
}

const DEFAULT_ITEMS: BottomNavItem[] = [
  { label: 'Home',    route: '/home',    icon: 'home-outline',        iconActive: 'home' },
  { label: 'Tasks',   route: '/tasks',   icon: 'checkbox-outline',    iconActive: 'checkbox' },
  { label: 'Focus',   route: '/focus',   icon: 'timer-outline',       iconActive: 'timer' },
  { label: 'Shop',    route: '/shop',    icon: 'bag-handle-outline',  iconActive: 'bag-handle' },
  { label: 'Profile', route: '/profile', icon: 'person-outline',      iconActive: 'person' },
];

export function BottomNav({ items = DEFAULT_ITEMS, orientation = 'horizontal' }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const colors = useTheme();
  const { isActive, abortFn } = useFocusSessionStore();

  const handlePress = (route: string) => {
    const isAlreadyHere = pathname === route || pathname.startsWith(route + '/');
    if (isAlreadyHere) return;

    if (isActive) {
      Alert.alert(
        'Focus session active',
        'Leaving now will cancel your session. You will not receive XP or coins.',
        [
          { text: 'Keep focusing', style: 'cancel' },
          {
            text: 'Abandon',
            style: 'destructive',
            onPress: () => {
              void (abortFn ? abortFn() : Promise.resolve()).then(() => {
                router.push(route);
              });
            },
          },
        ],
      );
      return;
    }

    router.push(route);
  };

  // ── Desktop sidebar ───────────────────────────────────────────────────────
  if (orientation === 'vertical') {
    return (
      <View style={{
        width: 220,
        backgroundColor: colors.surface,
        borderRightWidth: 1,
        borderRightColor: `${colors.primary}25`,
        paddingTop: 32,
        paddingBottom: 24,
        paddingHorizontal: spacing.md,
        flexDirection: 'column',
        gap: 4,
      }}>
        {/* Brand */}
        <View style={{ paddingHorizontal: spacing.xs, marginBottom: spacing.xl }}>
          <Text style={{ color: colors.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 1, marginBottom: 4 }}>
            STUDYFLOW
          </Text>
          <Text style={{ color: colors.primary, fontSize: 22, fontWeight: '900', lineHeight: 26 }}>
            Dashboard
          </Text>
        </View>

        {items.map((item) => {
          const isActive_ = item.route
            ? pathname === item.route || pathname.startsWith(item.route + '/')
            : false;
          const isFocus = item.route === '/focus';

          return (
            <TouchableOpacity
              key={item.route ?? item.label}
              onPress={() => item.route && handlePress(item.route)}
              activeOpacity={0.75}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                paddingVertical: 12,
                paddingHorizontal: spacing.sm,
                borderRadius: 14,
                backgroundColor: isActive_ ? `${colors.primary}18` : 'transparent',
                borderWidth: isActive_ ? 1 : 0,
                borderColor: `${colors.primary}30`,
                opacity: isActive && !isFocus ? 0.4 : 1,
              }}
            >
              {isActive_ && (
                <View style={{
                  position: 'absolute',
                  left: 0,
                  width: 3,
                  height: 32,
                  borderRadius: 2,
                  backgroundColor: colors.primary,
                }} />
              )}
              <Ionicons
                name={isActive_ ? item.iconActive : item.icon}
                size={20}
                color={isActive_ ? colors.primary : colors.textMuted}
              />
              <Text style={{
                color: isActive_ ? colors.primary : colors.textMuted,
                fontSize: 14,
                fontWeight: isActive_ ? '700' : '500',
              }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  // ── Mobile bottom bar ─────────────────────────────────────────────────────
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: isActive ? colors.primary : `${colors.primary}55`,
        paddingHorizontal: spacing.sm,
        paddingTop: spacing.xs,
        paddingBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.40,
        shadowRadius: 16,
        elevation: 20,
      }}
    >
      {items.map((item) => {
        const isCurrentRoute = item.route
          ? pathname === item.route || pathname.startsWith(item.route + '/')
          : false;
        const isFocus = item.route === '/focus';

        return (
          <TouchableOpacity
            key={item.route ?? item.label}
            onPress={() => item.route && handlePress(item.route)}
            style={{
              flex: 1,
              alignItems: 'center',
              paddingTop: spacing.sm,
              paddingBottom: spacing.xs,
              gap: 3,
              opacity: isActive && !isFocus ? 0.4 : 1,
            }}
          >
            {isCurrentRoute && (
              <>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: 32,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.9,
                    shadowRadius: 8,
                  }}
                />
                <View
                  style={{
                    position: 'absolute',
                    width: 52,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${colors.primary}18`,
                    borderWidth: 1,
                    borderColor: `${colors.primary}30`,
                  }}
                />
              </>
            )}
            <Ionicons
              name={isCurrentRoute ? item.iconActive : item.icon}
              size={22}
              color={isCurrentRoute ? colors.primary : colors.textMuted}
            />
            <Text
              style={{
                color: isCurrentRoute ? colors.primary : colors.textMuted,
                fontSize: 10,
                fontWeight: isCurrentRoute ? '800' : '500',
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
