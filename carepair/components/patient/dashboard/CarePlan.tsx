// components/patient/dashboard/CarePlan.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../../constants/Colors';

interface CarePlanItem {
  id: string;
  title: string;
  description: string;
  frequency: string;
  source: 'ai' | 'therapist';
  completed?: boolean;
}

function CarePlanCard({ item }: { item: CarePlanItem }) {
  return (
    <View style={styles.carePlanCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.sourceText}>
          {item.source === 'ai' ? 'AI Companion Suggestion' : 'Therapist Assigned'}
        </Text>
      </View>
      <Text style={styles.cardDescription}>
        {item.description} — {item.frequency}
      </Text>
      {item.source === 'ai' && !item.completed && (
        <TouchableOpacity style={styles.completeButton}>
          <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
          <Text style={styles.completeButtonText}>Mark Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function CarePlan() {
  const router = useRouter();

  const carePlanItems: CarePlanItem[] = [
    {
      id: '1',
      title: 'Guided Mindfulness',
      description: 'Anxiety Management',
      frequency: '10 mins • Daily',
      source: 'ai',
    },
    {
      id: '2',
      title: 'Cognitive Reframing Journal',
      description: 'Self-Reflection',
      frequency: 'Evening • 3x Week',
      source: 'therapist',
    },
    {
      id: '3',
      title: 'Deep Breathing Exercise',
      description: 'Stress Management',
      frequency: '5 mins • Twice Daily',
      source: 'ai',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Personalized Care Plan</Text>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI UPDATED</Text>
        </View>
      </View>

      {/* Care Plan Items */}
      <View style={styles.itemsList}>
        {carePlanItems.map((item) => (
          <CarePlanCard key={item.id} item={item} />
        ))}
      </View>

      {/* View Full Plan Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.viewFullButton}
          onPress={() => router.push('/(patient)/care-plan' as any)}
        >
          <Text style={styles.viewFullButtonText}>View Full Care Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.slate[900],
  },
  aiBadge: {
    backgroundColor: Colors.blue[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.blue[700],
  },
  itemsList: {
    gap: 16,
    marginBottom: 16,
  },
  carePlanCard: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[200],
    paddingBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.slate[900],
    flex: 1,
  },
  sourceText: {
    fontSize: 11,
    color: Colors.slate[500],
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.slate[600],
    marginBottom: 12,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.blue[600],
    paddingVertical: 12,
    borderRadius: 10,
  },
  completeButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.slate[200],
    paddingTop: 16,
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.blue[600],
    paddingVertical: 14,
    borderRadius: 10,
  },
  viewFullButtonText: {
    color: Colors.blue[600],
    fontSize: 14,
    fontWeight: '600',
  },
});