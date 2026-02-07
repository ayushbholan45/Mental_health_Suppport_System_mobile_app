// app/(therapist)/_layout.tsx
import { Stack } from 'expo-router';

export default function TherapistLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // No headers
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="appointments" />
      <Stack.Screen name="messages" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}