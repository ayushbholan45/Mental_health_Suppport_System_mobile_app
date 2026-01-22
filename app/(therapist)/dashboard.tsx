// app/(therapist)/dashboard.tsx
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
import { authAPI, therapistAPI } from '../../utils/api';
import Colors from '../../constants/Colors';
import DashboardStats from '../../components/therapist/DashboardStats';
import UpcomingAppointments from '../../components/therapist/UpcomingAppointments';

interface User {
  id: number;
  full_name: string;
  role: string;
}

export default function TherapistDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const loadTherapist = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      
      if (currentUser.role !== 'therapist') {
        router.replace('/(auth)/login');
        return;
      }
      
      setUser(currentUser);
      await therapistAPI.getProfile();
    } catch (error) {
      console.error('Failed to load therapist dashboard', error);
      router.replace('/(auth)/login');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTherapist();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadTherapist();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.blue[600]} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.full_name}
        </Text>
        <Text style={styles.subtitleText}>
          Here's what's happening with your practice today.
        </Text>
      </View>

      <DashboardStats />

      <View style={styles.section}>
        <UpcomingAppointments />
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
  welcomeText: {
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