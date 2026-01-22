// components/therapist/DashboardStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const stats = [
  {
    title: "Total Patients",
    value: "48",
    change: "+12%",
    icon: "people" as const,
    color: Colors.blue[500],
  },
  {
    title: "Today's Sessions",
    value: "8",
    change: "3 remaining",
    icon: "calendar" as const,
    color: Colors.purple[500],
  },
  {
    title: "Hours This Week",
    value: "32",
    change: "+5 hours",
    icon: "time" as const,
    color: Colors.green[700],
  },
  {
    title: "Success Rate",
    value: "94%",
    change: "+2%",
    icon: "trending-up" as const,
    color: Colors.orange[700],
  },
];

const DashboardStats = () => {
  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <View style={styles.topRow}>
            <View style={[styles.iconContainer, { backgroundColor: stat.color }]}>
              <Ionicons name={stat.icon} size={24} color={Colors.white} />
            </View>
            <Text style={styles.changeText}>{stat.change}</Text>
          </View>
          <Text style={styles.valueText}>{stat.value}</Text>
          <Text style={styles.titleText}>{stat.title}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    width: '47%',
    borderWidth: 1,
    borderColor: Colors.slate[100],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    color: Colors.green[700],
    fontWeight: '500',
  },
  valueText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 4,
  },
  titleText: {
    fontSize: 14,
    color: Colors.slate[600],
  },
});

export default DashboardStats;