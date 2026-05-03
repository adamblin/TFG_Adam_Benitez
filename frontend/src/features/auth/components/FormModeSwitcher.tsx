import { Pressable, Text, View } from 'react-native';
import type { FormMode } from '../hooks/useLoginForm';
import { styles } from './FormModeSwitcher.styles';
import { colors } from '../../../shared/theme';

type FormModeSwitcherProps = {
  mode: FormMode;
  onChange: (mode: FormMode) => void;
};

const FORM_MODES: FormMode[] = ['login', 'register'];

export function FormModeSwitcher({ mode, onChange }: FormModeSwitcherProps) {
  return (
    <View style={styles.switchRow}>
      {FORM_MODES.map((value) => (
        <Pressable
          key={value}
          onPress={() => onChange(value)}
          style={[
            styles.switchButton,
            mode === value ? styles.switchButtonActive : null,
          ]}
        >
          <Text
            style={[
              styles.switchButtonText,
              {
                color: mode === value ? colors.primary : colors.textMuted,
              },
            ]}
          >
            {value === 'login' ? 'Login' : 'Register'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
