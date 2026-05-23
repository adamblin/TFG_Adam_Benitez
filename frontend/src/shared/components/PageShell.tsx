import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../theme/colors';
import { useTheme } from '../theme';
import { BottomNav, type BottomNavProps } from './BottomNav';

const DESKTOP_BREAKPOINT = 768;
const CONTENT_MAX_WIDTH = 860;

interface PageShellProps extends Omit<BottomNavProps, 'items'> {
  children: ReactNode;
  navItems?: BottomNavProps['items'];
}

export function PageShell({ children, navItems }: PageShellProps) {
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  // ── Desktop layout ─────────────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, flexDirection: 'row' }}>
        <StatusBar style="light" />

        {/* Full-screen accent glow */}
        <LinearGradient
          colors={[`${colors.primary}20`, `${colors.secondary}0a`, 'transparent']}
          locations={[0, 0.3, 0.65]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />

        {/* Sidebar navigation */}
        <BottomNav items={navItems} orientation="vertical" />

        {/* Main content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: spacing.xl,
            paddingBottom: spacing.xl,
            maxWidth: CONTENT_MAX_WIDTH,
            width: '100%',
            alignSelf: 'center',
          }}
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[`${colors.primary}20`, `${colors.secondary}0a`, 'transparent']}
        locations={[0, 0.3, 0.65]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      />
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: 112,
        }}
      >
        {children}
      </ScrollView>
      <BottomNav items={navItems} orientation="horizontal" />
    </SafeAreaView>
  );
}
