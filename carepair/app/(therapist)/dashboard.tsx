// app/(therapist)/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext'; // Use global auth context
import { therapistAPI } from '../../utils/api';
import Colors from '../../constants/Colors';
import DashboardStats from '../../components/therapist/DashboardStats';
import UpcomingAppointments from '../../components/therapist/UpcomingAppointments';
import QuickActions from '../../components/therapist/QuickActions';
import { Ionicons } from '@expo/vector-icons';

export default function TherapistDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // Safety check: Ensure only therapists can see this
  useEffect(() => {
    if (!authLoading && user && user.role !== 'therapist') {
      router.replace('/(auth)/login');
    }
  }, [user, authLoading]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await therapistAPI.getProfile();
    } catch (error) {
      console.error('Refresh failed', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.blue?.[600] || '#2563EB'} />
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
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcomeText}>
              Welcome back, {user?.full_name?.split(' ')[0] || 'Doctor'}
            </Text>
            <Text style={styles.subtitleText}>
              Here's what's happening with your practice today.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {/* Profile Button */}
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={() => router.push('/(therapist)/profile')}
              activeOpacity={0.7}
            >
              <Ionicons name="person-outline" size={22} color={Colors.blue?.[600] || '#2563EB'} />
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={logout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={22} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <DashboardStats />

      <View style={styles.section}>
        <QuickActions />
      </View>

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
    backgroundColor: Colors.slate?.[50] || '#F8FAFC',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.slate?.[50] || '#F8FAFC',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.slate?.[500] || '#64748B',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: Colors.white || '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate?.[100] || '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.slate?.[900] || '#0F172A',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 15,
    color: Colors.slate?.[600] || '#475569',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  profileButton: {
    padding: 8,
    backgroundColor: Colors.blue?.[50] || '#EFF6FF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  section: {
    marginTop: 16,
  },
});