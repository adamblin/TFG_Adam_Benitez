import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AppCard } from './AppCard';
import { styles } from './FormShell.styles';

type FormShellProps = {
  children: ReactNode;
};

export function FormShell({ children }: FormShellProps) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <AppCard>{children}</AppCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
