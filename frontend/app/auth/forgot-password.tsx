import React from 'react'
import { View, Text, Button } from 'react-native'
import { useRouter } from 'expo-router'

export default function ForgotPassword() {
  const router = useRouter()
  return (
    <View>
      <Text>Forgot password (placeholder)</Text>
      <Button title="Back to login" onPress={() => router.push('/auth/login')} />
    </View>
  )
}
