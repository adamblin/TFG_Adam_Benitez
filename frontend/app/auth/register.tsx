import React from 'react'
import { View, Text, Button } from 'react-native'
import { useRouter } from 'expo-router'

export default function Register() {
  const router = useRouter()
  return (
    <View>
      <Text>Register (placeholder)</Text>
      <Button title="Back to login" onPress={() => router.push('/auth/login')} />
    </View>
  )
}
