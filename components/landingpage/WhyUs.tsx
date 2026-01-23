// components/landingpage/WhyUs.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const { width, height: screenHeight } = Dimensions.get('window');

interface Feature {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: 'blue' | 'purple' | 'teal';
}

const features: Feature[] = [
  {
    icon: 'calendar-outline',
    title: 'Flexible Scheduling',
    description:
      'Book sessions that fit your lifestyle. Easily manage appointments and find times that work for you with our user-friendly platform.',
    color: 'blue',
  },
  {
    icon: 'people-outline',
    title: 'Licensed Therapists',
    description:
      'Connect with verified, experienced mental health professionals specializing in various areas to provide the best care for your needs.',
    color: 'purple',
  },
  {
    icon: 'lock-closed-outline',
    title: 'Safe & Confidential Space',
    description:
      'Your privacy is our top priority. All sessions and data are secured with end-to-end encryption and strictly confidential protocols.',
    color: 'teal',
  },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { icon: string; iconBg: string }> = {
    blue: { icon: Colors.blue[600], iconBg: Colors.blue[100] },
    purple: { icon: Colors.purple[600], iconBg: Colors.purple[100] },
    teal: { icon: Colors.teal[600], iconBg: Colors.teal[100] },
  };
  return colors[color];
};

// Scroll-triggered animation wrapper
const AnimateOnScroll = ({
  children,
  direction = 'up',
  delay = 0,
  scrollY,
}: {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  scrollY: number;
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [elementY, setElementY] = useState<number | null>(null);
  const viewRef = useRef<View>(null);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(direction === 'up' ? 40 : 0);
  const translateX = useSharedValue(
    direction === 'left' ? 40 : direction === 'right' ? -40 : 0
  );
  const scale = useSharedValue(direction === 'scale' ? 0.95 : 1);

  const measurePosition = () => {
    if (viewRef.current) {
      viewRef.current.measureInWindow((x, y) => {
        setElementY(y);
      });
    }
  };

  useEffect(() => {
    if (elementY !== null && !hasAnimated) {
      if (elementY < screenHeight * 0.85 && elementY > -100) {
        setHasAnimated(true);
        setTimeout(() => {
          opacity.value = withTiming(1, { duration: 800 });
          translateY.value = withTiming(0, { duration: 800 });
          translateX.value = withTiming(0, { duration: 800 });
          scale.value = withTiming(1, { duration: 800 });
        }, delay);
      }
    }
  }, [scrollY, elementY, hasAnimated]);

  useEffect(() => {
    measurePosition();
  }, [scrollY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View ref={viewRef} style={animatedStyle} onLayout={measurePosition}>
      {children}
    </Animated.View>
  );
};

const FeatureCard = ({
  feature,
  index,
  scrollY,
}: {
  feature: Feature;
  index: number;
  scrollY: number;
}) => {
  const colors = getColorClasses(feature.color);

  return (
    <AnimateOnScroll direction="up" delay={index * 150} scrollY={scrollY}>
      <View style={styles.featureCard}>
        <View style={[styles.iconContainer, { backgroundColor: colors.iconBg }]}>
          <Ionicons name={feature.icon} size={24} color={colors.icon} />
        </View>
        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDesc}>{feature.description}</Text>
      </View>
    </AnimateOnScroll>
  );
};

interface WhyUsProps {
  scrollY?: number;
}

const WhyUs = ({ scrollY = 0 }: WhyUsProps) => {
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <LinearGradient
      colors={[Colors.blue[100], Colors.white]}
      style={styles.container}
    >
      {/* Header */}
      <AnimateOnScroll direction="up" delay={0} scrollY={scrollY}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Why <Text style={styles.titleHighlight}>We Are</Text> The Right Choice
          </Text>
          <Text style={styles.subtitle}>For Your Mental Health Journey</Text>
        </View>
      </AnimateOnScroll>

      {/* Feature Cards */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} scrollY={scrollY} />
        ))}
      </View>

      {/* CTA Card */}
      <AnimateOnScroll direction="scale" delay={100} scrollY={scrollY}>
        <View style={styles.ctaCard}>
          <LinearGradient
            colors={[Colors.blue[600], Colors.blue[700], Colors.blue[800]]}
            style={styles.ctaGradient}
          >
            <Animated.View style={[styles.decorativeCircle1, pulseStyle]} />
            <View style={styles.decorativeCircle2} />

            <View style={styles.ctaContent}>
              <View style={styles.ctaIconContainer}>
                <Ionicons name="sparkles" size={24} color={Colors.white} />
              </View>
              <View style={styles.ctaTextContainer}>
                <Text style={styles.ctaTitle}>Shape Your Future Health</Text>
                <Text style={styles.ctaDescription}>
                  Join us to embark on a personalized journey towards better
                  mental well-being. We match you with the right support to help
                  you thrive.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
              <Text style={styles.ctaButtonText}>Find Your Therapist</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.blue[700]} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </AnimateOnScroll>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.slate[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  titleHighlight: {
    color: Colors.blue[600],
  },
  subtitle: {
    fontSize: 18,
    color: Colors.slate[600],
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: Colors.slate[600],
    lineHeight: 22,
  },
  ctaCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  ctaGradient: {
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: `${Colors.blue[500]}33`,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: `${Colors.purple[500]}33`,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    position: 'relative',
    zIndex: 1,
  },
  ctaIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: `${Colors.white}33`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ctaTextContainer: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 14,
    color: Colors.blue[100],
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    position: 'relative',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blue[700],
  },
});

export default WhyUs;