// app/index.tsx - DEBUG VERSION
import React, { useState } from 'react';
import { StyleSheet, StatusBar, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import {
  HeroSection,
  OurMission,
  CareOptions,
  WhoIsItFor,
  TherapistsSection,
  WhyUs,
  FooterSection,
} from '../components/landingpage';
import Colors from '../constants/Colors';
import { useRouter } from 'expo-router';

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  };

  const handleGetMatched = () => {
    router.push('/(auth)/signup');
  };

  const handleLearnMore = () => {
    console.log('Learn More pressed');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <HeroSection
          onGetMatched={handleGetMatched}
          onLearnMore={handleLearnMore}
        />
        <OurMission scrollY={scrollY} /> 
        <CareOptions scrollY={scrollY} />
        <WhoIsItFor scrollY={scrollY} />
        <TherapistsSection scrollY={scrollY} />
        <WhyUs scrollY={scrollY} />
        <FooterSection scrollY={scrollY} />
      </Animated.ScrollView>
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