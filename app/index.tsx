// app/index.tsx
import React from 'react';
import { ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import {
  HeroSection,
  OurMission,
  CareOptions,
  WhoIsItFor,
  TherapistsSection,
  WhyUs,
} from '../components/landingpage';
import Colors from '../constants/Colors';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const router = useRouter();

  const handleGetMatched = () => {
    router.push('/(auth)/signup');
  };

  const handleLearnMore = () => {
    console.log('Learn More pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Header />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <HeroSection
          onGetMatched={handleGetMatched}
          onLearnMore={handleLearnMore}
        />
        <OurMission />
        <CareOptions />
        <WhoIsItFor />
        <TherapistsSection />
        <WhyUs />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
});