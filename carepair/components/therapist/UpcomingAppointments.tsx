// components/therapist/UpcomingAppointments.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const appointments = [
  {
    id: 1,
    patient: "John Doe",
    time: "10:00 AM",
    duration: "50 min",
    type: "online",
    status: "confirmed",
  },
  {
    id: 2,
    patient: "Jane Smith",
    time: "11:30 AM",
    duration: "50 min",
    type: "offline",
    status: "confirmed",
  },
  {
    id: 3,
    patient: "Mike Johnson",
    time: "2:00 PM",
    duration: "50 min",
    type: "online",
    status: "pending",
  },
];

const UpcomingAppointments = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Upcoming Appointments</Text>
      
      <View style={styles.list}>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.leftSection}>
              {/* Avatar */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {appointment.patient.charAt(0)}
                </Text>
              </View>
              
              {/* Info */}
              <View style={styles.infoContainer}>
                <Text style={styles.patientName}>{appointment.patient}</Text>
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={14} color={Colors.slate[500]} />
                    <Text style={styles.detailText}>{appointment.time}</Text>
                  </View>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.detailText}>{appointment.duration}</Text>
                  <Text style={styles.dot}>•</Text>
                  <View style={styles.detailItem}>
                    <Ionicons 
                      name={appointment.type === "online" ? "videocam-outline" : "location-outline"} 
                      size={14} 
                      color={Colors.slate[500]} 
                    />
                    <Text style={styles.detailText}>
                      {appointment.type === "online" ? "Online" : "In-person"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Button */}
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.slate[100],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 20,
  },
  list: {
    gap: 12,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.slate[100],
    borderRadius: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  patientName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.slate[900],
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: Colors.slate[600],
  },
  dot: {
    fontSize: 12,
    color: Colors.slate[400],
    marginHorizontal: 6,
  },
  startButton: {
    backgroundColor: Colors.blue[600],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
});

export default UpcomingAppointments;