// app/(patient)/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView,
  RefreshControl 
} from 'react-native';
import { useRouter } from 'expo-router';
import { authAPI } from '../../utils/api';
import Colors from '../../constants/Colors';
import { StatsGrid, UpcomingSessions, CarePlan } from '../../components/patient/dashboard';

interface User {
  id: number;
  full_name: string;
  role: string;
}

export default function PatientDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadPatient = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      
      if (currentUser.role !== 'patient') {
        router.replace('/(auth)/login');
        return;
      }
      
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load patient dashboard', error);
      router.replace('/(auth)/login');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPatient();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPatient();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.blue[600]} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.greetingText}>
          {getGreeting()}, {user?.full_name?.split(' ')[0] || 'there'}
        </Text>
        <Text style={styles.subtitleText}>
          Here is what's happening with your health today.
        </Text>
      </View>

      <View style={styles.section}>
        <StatsGrid />
      </View>

      <View style={styles.section}>
        <UpcomingSessions />
      </View>

      <View style={styles.section}>
        <CarePlan />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.slate[50],
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.slate[500],
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: Colors.slate[600],
  },
  section: {
    marginTop: 16,
  },
});