import React, { ReactNode } from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors, spacing } from '../theme';
import { BottomNav, type BottomNavProps } from './BottomNav';

interface PageShellProps extends Omit<BottomNavProps, 'items'> {
  children: ReactNode;
  navItems?: BottomNavProps['items'];
}

export function PageShell({ children, navItems }: PageShellProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{
          padding: spacing.lg,
          paddingBottom: 112,
        }}
      >
        {children}
      </ScrollView>
      <BottomNav items={navItems} />
    </SafeAreaView>
  );
}
