import { TextInput } from 'react-native';
import { makeStyles } from './AppInput.styles';
import { useTheme } from '../theme';

type AppInputProps = React.ComponentProps<typeof TextInput>;

export function AppInput(props: AppInputProps) {
  const colors = useTheme();
  const styles = makeStyles(colors);
  return <TextInput {...props} style={[styles.base, props.style]} />;
}
