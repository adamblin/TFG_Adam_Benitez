import React from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../src/shared/theme';
import styles from './styles';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Your productivity overview</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Hoy</Text>
          <Text style={styles.cardBody}>Tareas completadas: 0</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/tasks')}>
          <Text style={styles.primaryButtonLabel}>Go to Tasks</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
