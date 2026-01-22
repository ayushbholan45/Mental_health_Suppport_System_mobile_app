// app/(therapist)/_layout.tsx
import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';

export default function TherapistLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.slate[50] },
      }}
    >
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}