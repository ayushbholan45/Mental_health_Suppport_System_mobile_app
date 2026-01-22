// components/patient/dashboard/UpcomingSessions.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../../constants/Colors';

interface Session {
  id: string;
  therapist: string;
  title: string;
  type: 'video' | 'in-person' | 'phone';
  date: string;
  time: string;
  matchScore: number;
  lastSentiment: string;
  avatar: string;
}

function SessionCard({ session }: { session: Session }) {
  const router = useRouter();

  return (
    <View style={styles.sessionCard}>
      {/* Top Row: Avatar, Info, Match Badge */}
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{session.avatar}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.therapistName}>{session.therapist}</Text>
          <Text style={styles.sessionType}>
            {session.title} •{' '}
            {session.type === 'video'
              ? 'Video Call'
              : session.type === 'in-person'
                ? 'In-Person'
                : 'Phone Call'}
          </Text>
          <Text style={styles.sentiment}>
            Last Session Sentiment: {session.lastSentiment}
          </Text>
        </View>
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{session.matchScore}% Match</Text>
        </View>
      </View>

      {/* Bottom Row: Date/Time, Actions */}
      <View style={styles.bottomRow}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{session.date}</Text>
          <Text style={styles.timeText}>{session.time}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="refresh" size={20} color={Colors.slate[400]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="close" size={20} color="#EF4444" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => router.push(`/(patient)/appointments/${session.id}` as any)}
          >
            <Text style={styles.detailsButtonText}>Session Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function UpcomingSessions() {
  const router = useRouter();
  
  const sessions: Session[] = [
    {
      id: '1',
      therapist: 'Dr. Sarah Johnson',
      title: 'Clinical Psychologist',
      type: 'video',
      date: 'Dec 30, 2025',
      time: '02:00 PM',
      matchScore: 98,
      lastSentiment: 'Anxious',
      avatar: 'SJ',
    },
    {
      id: '2',
      therapist: 'Counsellor David Chen',
      title: 'CBT Specialist',
      type: 'in-person',
      date: 'Jan 05, 2026',
      time: '11:30 AM',
      matchScore: 85,
      lastSentiment: 'Stable',
      avatar: 'DC',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Sessions</Text>
        <TouchableOpacity onPress={() => router.push('/(patient)/appointments' as any)}>
          <Text style={styles.viewHistoryText}>View History</Text>
        </TouchableOpacity>
      </View>

      {/* Sessions List */}
      <View style={styles.sessionsList}>
        {sessions.map((session) => (
          <SessionCard key={session.id} session={session} />
        ))}
      </View>

      {/* Empty State */}
      {sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No upcoming sessions</Text>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => router.push('/find-therapist' as any)}
          >
            <Text style={styles.bookButtonText}>Book an Appointment</Text>
          </TouchableOpacity>
        </View>
      )}
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
  viewHistoryText: {
    fontSize: 14,
    color: Colors.blue[600],
    fontWeight: '500',
  },
  sessionsList: {
    gap: 12,
  },
  sessionCard: {
    borderWidth: 1,
    borderColor: Colors.slate[200],
    borderRadius: 12,
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.blue[600],
  },
  infoContainer: {
    flex: 1,
  },
  therapistName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 13,
    color: Colors.slate[600],
    marginBottom: 4,
  },
  sentiment: {
    fontSize: 12,
    color: Colors.slate[500],
  },
  matchBadge: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C2410C',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeContainer: {
    // alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.slate[900],
  },
  timeText: {
    fontSize: 13,
    color: Colors.slate[600],
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  detailsButton: {
    backgroundColor: Colors.slate[900],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  detailsButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.slate[500],
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: Colors.blue[600],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});