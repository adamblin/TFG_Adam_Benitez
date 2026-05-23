import { Text, View, type KeyboardTypeOptions, type TextInputProps } from 'react-native';
import { AppInput } from './AppInput';
import { makeStyles } from './AppField.styles';
import { useTheme } from '../theme';

type AppFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  maxLength?: number;
  placeholder?: string;
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoCorrect?: boolean;
};

export function AppField({
  label,
  value,
  onChangeText,
  maxLength,
  placeholder,
  placeholderTextColor,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
}: AppFieldProps) {
  const colors = useTheme();
  const styles = makeStyles(colors);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <AppInput
        value={value}
        onChangeText={onChangeText}
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
      />
    </View>
  );
}
