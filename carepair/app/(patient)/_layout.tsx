/**
 * Patient Layout
 * 
 * This layout wraps all patient routes and ensures proper navigation
 * between patient screens (home, dashboard, appointments, etc.)
 */

import { Stack } from 'expo-router';

export default function PatientLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="home/index" />
      <Stack.Screen name="dashboard/index" />
      <Stack.Screen name="appointments/index" />
      <Stack.Screen name="messages/index" />
      <Stack.Screen name="journal/index" />
      <Stack.Screen name="care-plan/index" />
      <Stack.Screen name="articles/index" />
      <Stack.Screen name="quizzes/index" />
      <Stack.Screen name="flashcards/index" />
      <Stack.Screen name="medications/index" />
      <Stack.Screen name="profile/index" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="support/index" />
      <Stack.Screen name="find-therapist/index" />
    </Stack>
  );
}