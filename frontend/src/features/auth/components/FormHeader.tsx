import { Text, View } from 'react-native';
import type { FormMode } from '../hooks/useLoginForm';
import { styles } from './FormHeader.styles';

type FormHeaderProps = {
  mode?: FormMode;
  badgeLabel?: string;
  title?: string;
  subtitle?: string;
};

export function FormHeader({ mode = 'login', badgeLabel, title, subtitle }: FormHeaderProps) {
  const resolvedBadge = badgeLabel ?? (mode === 'login' ? 'LOGIN' : 'REGISTER');
  const resolvedTitle = title ?? (mode === 'login' ? 'Accede a tu cuenta' : 'Crea tu cuenta');

  return (
    <>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{resolvedBadge}</Text>
      </View>
      <Text style={styles.title}>{resolvedTitle}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </>
  );
}
