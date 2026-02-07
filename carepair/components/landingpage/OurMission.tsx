// components/landingpage/OurMission.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const { width, height: screenHeight } = Dimensions.get('window');

const features = [
  {
    icon: 'pulse' as const,
    title: 'Smart Health Metrics',
    description:
      'Wake up to actionable health summaries, personalized based on your sleep, mood, movement, and input.',
    image: require('../../assets/images/home/match.png'),
    points: [
      'Personalized specs every morning',
      'Trend detection across time',
      'Custom action plans',
    ],
    color: 'blue',
  },
  {
    icon: 'trending-up' as const,
    title: 'Habit-Based Recommendation',
    description:
      'No clunky setup—connect your favorite devices or just type how you feel. AddAction adapts either way.',
    image: require('../../assets/images/home/companion.png'),
    points: [
      'Syncs with Apple Health & Fitbit',
      'Tracks mood, energy, and stress',
      'Supports manual or automatic data',
    ],
    color: 'purple',
  },
  {
    icon: 'medkit' as const,
    title: 'AI Symptom Checker',
    description:
      'From breathing guides to burnout prevention, AddAction helps you build mental resilience.',
    image: require('../../assets/images/home/insights.png'),
    points: [
      'On-demand mindfulness tools',
      'Guided stress check-ins',
      'AI-powered emotional tracking',
    ],
    color: 'teal',
  },
];

const getColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: Colors.blue[600],
    purple: Colors.purple[600],
    teal: Colors.teal[600],
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
  direction?: 'up' | 'left' | 'right';
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
  feature: typeof features[0];
  index: number;
  scrollY: number;
}) => {
  const color = getColor(feature.color);
  const isEven = index % 2 === 0;

  return (
    <View style={styles.featureContainer}>
      <AnimateOnScroll direction={isEven ? 'right' : 'left'} delay={0} scrollY={scrollY}>
        <View style={styles.imageContainer}>
          {feature.image ? (
            <Image
              source={feature.image}
              style={styles.featureImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.featureImage, styles.imagePlaceholder, { backgroundColor: `${color}20` }]}>
              <Ionicons name={feature.icon} size={80} color={`${color}60`} />
            </View>
          )}
        </View>
      </AnimateOnScroll>

      <AnimateOnScroll direction={isEven ? 'left' : 'right'} delay={150} scrollY={scrollY}>
        <View style={styles.featureContent}>
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Ionicons name={feature.icon} size={24} color={Colors.white} />
          </View>

          <Text style={styles.featureTitle}>{feature.title}</Text>
          <Text style={styles.featureDescription}>{feature.description}</Text>

          <View style={styles.pointsContainer}>
            {feature.points.map((point, i) => (
              <View key={i} style={styles.pointItem}>
                <View style={[styles.checkIcon, { backgroundColor: color }]}>
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                </View>
                <Text style={styles.pointText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>
      </AnimateOnScroll>
    </View>
  );
};

interface OurMissionProps {
  scrollY?: number;
}

const OurMission = ({ scrollY = 0 }: OurMissionProps) => {
  return (
    <View style={styles.container}>
      <AnimateOnScroll direction="up" delay={0} scrollY={scrollY}>
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Our Mission</Text>
          </View>
          <Text style={styles.title}>
            AI That Understands You, Not Just Your Data
          </Text>
          <Text style={styles.subtitle}>
            We go beyond step counters and calorie logs. Add Action offers
            context-aware health coaching, habit support, and real-time insights
            — like a wellness team in your pocket.
          </Text>
        </View>
      </AnimateOnScroll>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} scrollY={scrollY} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  badge: {
    backgroundColor: Colors.blue[50],
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: Colors.blue[600],
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.slate[900],
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.slate[600],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.9,
  },
  featuresContainer: {
    gap: 48,
  },
  featureContainer: {
    gap: 24,
  },
  imageContainer: {
    alignItems: 'center',
  },
  featureImage: {
    width: width - 48,
    height: width * 0.65,
    borderRadius: 16,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    paddingHorizontal: 8,
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
    fontSize: 24,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 16,
    color: Colors.slate[600],
    lineHeight: 24,
    marginBottom: 20,
  },
  pointsContainer: {
    gap: 12,
  },
  pointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  pointText: {
    fontSize: 15,
    color: Colors.slate[700],
    flex: 1,
  },
});

export default OurMission;