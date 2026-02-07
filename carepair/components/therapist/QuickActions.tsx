// components/therapist/QuickActions.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

interface __ActionCard__ {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  route: string;
}

export default function QuickActions() {
  const router = useRouter();

  const actions: __ActionCard__[] = [
    {
      title: 'Schedule',
      subtitle: 'Manage appointments',
      icon: 'calendar',
      color: Colors.blue[600],
      route: '/(therapist)/appointments',
    },
    {
      title: 'Patients',
      subtitle: 'Messages & notes',
      icon: 'chatbubbles',
      color: Colors.purple[600],
      route: '/(therapist)/messages',
    },
    {
      title: 'My Blogs',
      subtitle: 'Create & publish',
      icon: 'create',
      color: Colors.green[700],
      route: '/(therapist)/blogs',
    },
    {
      title: 'Analytics',
      subtitle: 'View insights',
      icon: 'stats-chart',
      color: Colors.orange[700],
      route: '/(therapist)/analytics',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(action.route as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon} size={24} color={Colors.white} />
            </View>
            <Text style={styles.cardTitle}>{action.title}</Text>
            <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.slate[500],
  },
});