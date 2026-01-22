// app/(patient)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export default function PatientLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.blue[600],
        tabBarInactiveTintColor: Colors.slate[400],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.slate[100],
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen 
        name="dashboard" 
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="appointments" 
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="messages" 
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }} 
      />
    </Tabs>
  );
}