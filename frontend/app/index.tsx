import { SafeAreaView, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LoginForm } from '../src/features/auth/components/LoginForm';
import { colors } from '../src/shared/theme';

export default function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style="light" />
      <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}
