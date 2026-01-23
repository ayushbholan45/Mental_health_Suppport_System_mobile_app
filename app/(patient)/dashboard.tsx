// app/(patient)/dashboard.tsx
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
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/Colors';
import { StatsGrid, UpcomingSessions, CarePlan } from '../../components/patient/dashboard';
import { Ionicons } from '@expo/vector-icons';

export default function PatientDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user && user.role !== 'patient') {
      router.replace('/(auth)/login');
    }
  }, [user, authLoading]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); 
  };

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.blue?.[600] || '#2563EB'} />
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
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingText}>
              {getGreeting()}, {user?.full_name?.split(' ')[0] || 'there'}
            </Text>
            <Text style={styles.subtitleText}>
              Here is what's happening today.
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={logout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color="#DC2626" />
          </TouchableOpacity>
        </View>
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
  greetingText: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.slate?.[900] || '#0F172A',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 15,
    color: Colors.slate?.[600] || '#475569',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
  },
  section: {
    marginTop: 16,
  },
});