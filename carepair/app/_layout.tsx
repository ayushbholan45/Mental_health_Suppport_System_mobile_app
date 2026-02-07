// app/_layout.tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  // Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    // Add Manrope if you have the font files
    // 'Manrope-Regular': require('../assets/fonts/Manrope-Regular.ttf'),
    // 'Manrope-Medium': require('../assets/fonts/Manrope-Medium.ttf'),
    // 'Manrope-SemiBold': require('../assets/fonts/Manrope-SemiBold.ttf'),
    // 'Manrope-Bold': require('../assets/fonts/Manrope-Bold.ttf'),
  });

  useEffect(() => {
    // Wait for fonts to load
    if (fontsLoaded || fontError) {
      setAppIsReady(true);
    }
  }, [fontsLoaded, fontError]);

  // Don't render app until fonts are loaded
  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen 
          name="(auth)" 
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="(patient)" />
        <Stack.Screen name="(therapist)" />
      </Stack>
    </AuthProvider>
  );
}