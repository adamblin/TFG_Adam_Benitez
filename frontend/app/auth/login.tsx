import React from 'react'
import { View, Text, Button } from 'react-native'
import { useRouter } from 'expo-router'

export default function Login() {
  const router = useRouter()
  return (
    <View>
      <Text>Login (placeholder)</Text>
      <Button title="Register" onPress={() => router.push('/auth/register')} />
      <Button title="Forgot password" onPress={() => router.push('/auth/forgot-password')} />
    </View>
  )
}
