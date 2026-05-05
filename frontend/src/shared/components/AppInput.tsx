import { TextInput } from 'react-native';
import { styles } from './AppInput.styles';

type AppInputProps = React.ComponentProps<typeof TextInput>;

export function AppInput(props: AppInputProps) {
  return <TextInput {...props} style={[styles.base, props.style]} />;
}
