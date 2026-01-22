// components/patient/dashboard/StatsGrid.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../../constants/Colors';

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  subtitle: string;
  href?: string;
}

function StatCard({ icon, label, value, subtitle, href }: StatCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (href) {
      router.push(href as any);
    }
  };

  const content = (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color={Colors.blue[600]} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );

  if (href) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

export default function StatsGrid() {
  return (
    <View style={styles.container}>
      <StatCard
        icon="calendar"
        label="Next Therapy Session"
        value="Dec 30, 02:00 PM"
        subtitle="Dr. Sarah Jenkins"
        href="/(patient)/appointments"
      />
      <StatCard
        icon="star"
        label="AI Match Compatibility"
        value="94% Match Score"
        subtitle="Based on Similarity Score"
      />
      <StatCard
        icon="trending-up"
        label="Recent Mood Sentiment"
        value="Primarily Positive"
        subtitle="Analysis from last response"
        href="/(patient)/journal"
      />
      <StatCard
        icon="chatbubble"
        label="AI Companion Insights"
        value="3 New Summaries"
        subtitle="Feedback only • No Diagnosis"
        href="/(patient)/articles"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.slate[600],
    textTransform: 'uppercase',
    flex: 1,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.slate[500],
  },
});