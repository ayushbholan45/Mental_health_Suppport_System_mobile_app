/**
 * Patient Dashboard Page
 * 
 * Main dashboard page showing:
 * - Personalized greeting
 * - Stats grid
 * - Upcoming sessions
 * - Care plan
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/patient/DashboardLayout';
import StatsGrid from '@/components/patient/dashboard/StatsGrid';
import UpcomingSessions from '@/components/patient/dashboard/UpcomingSessions';
import CarePlan from '@/components/patient/dashboard/CarePlan';

export default function DashboardPage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good morning');

  // Get the first name from the full_name string
  const firstName = user?.full_name?.split(' ')[0] || 'User';

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    setGreeting(getGreeting());
  }, []);

  return (
    <DashboardLayout>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {greeting}, {firstName}
          </Text>
          <Text style={styles.subtitle}>
            Here is what is happening with your health today.
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.section}>
          <StatsGrid />
        </View>

        {/* Upcoming Sessions & Care Plan */}
        <View style={styles.gridContainer}>
          <View style={styles.gridLeft}>
            <UpcomingSessions />
          </View>
          <View style={styles.gridRight}>
            <CarePlan />
          </View>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  gridContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
    paddingBottom: 32,
    gap: 20,
  },
  gridLeft: {
    flex: 1,
  },
  gridRight: {
    flex: 1,
  },
});