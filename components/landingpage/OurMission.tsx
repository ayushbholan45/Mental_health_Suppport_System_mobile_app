// components/landingpage/OurMission.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface FeatureItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  points: string[];
  color: 'blue' | 'purple' | 'teal';
  image: any;
}

const features: FeatureItem[] = [
  {
    icon: 'pulse',
    title: 'Smart Health Metrics',
    description:
      'Wake up to actionable health summaries, personalized based on your sleep, mood, movement, and input.',
    // Replace with your actual image: require('../../assets/images/match.png'),
    image: null,
    points: [
      'Personalized specs every morning',
      'Trend detection across time',
      'Custom action plans',
    ],
    color: 'blue',
  },
  {
    icon: 'trending-up',
    title: 'Habit-Based Recommendation',
    description:
      'No clunky setup—connect your favorite devices or just type how you feel. AddAction adapts either way.',
    // Replace with your actual image: require('../../assets/images/companion.png'),
    image: null,
    points: [
      'Syncs with Apple Health & Fitbit',
      'Tracks mood, energy, and stress',
      'Supports manual or automatic data',
    ],
    color: 'purple',
  },
  {
    icon: 'medkit',
    title: 'AI Symptom Checker',
    description:
      'From breathing guides to burnout prevention, AddAction helps you build mental resilience.',
    // Replace with your actual image: require('../../assets/images/insights.png'),
    image: null,
    points: [
      'On-demand mindfulness tools',
      'Guided stress check-ins',
      'AI-powered emotional tracking',
    ],
    color: 'teal',
  },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { gradient: string[]; text: string }> = {
    blue: {
      gradient: [Colors.blue[500], Colors.blue[600]],
      text: Colors.blue[600],
    },
    purple: {
      gradient: [Colors.purple[500], Colors.purple[600]],
      text: Colors.purple[600],
    },
    teal: {
      gradient: [Colors.teal[500], Colors.teal[600]],
      text: Colors.teal[600],
    },
  };
  return colors[color];
};

const FeatureCard: React.FC<{ feature: FeatureItem; index: number }> = ({
  feature,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const colors = getColorClasses(feature.color);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featureContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Image */}
      <View style={styles.imageContainer}>
        <View
          style={[
            styles.imageGlow,
            { backgroundColor: `${colors.text}15` },
          ]}
        />
        {feature.image ? (
          <Image
            source={feature.image}
            style={styles.featureImage}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.featureImage, styles.imagePlaceholder, { backgroundColor: `${colors.text}20` }]}>
            <Ionicons name={feature.icon} size={80} color={`${colors.text}60`} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.featureContent}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.text },
          ]}
        >
          <Ionicons name={feature.icon} size={24} color={Colors.white} />
        </View>

        <Text style={styles.featureTitle}>{feature.title}</Text>
        <Text style={styles.featureDescription}>{feature.description}</Text>

        {/* Points */}
        <View style={styles.pointsContainer}>
          {feature.points.map((point, i) => (
            <View key={i} style={styles.pointItem}>
              <View
                style={[
                  styles.checkIcon,
                  { backgroundColor: colors.text },
                ]}
              >
                <Ionicons name="checkmark" size={14} color={Colors.white} />
              </View>
              <Text style={styles.pointText}>{point}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const OurMission: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Our Mission</Text>
        </View>
        <Text style={styles.title}>
          AI That Understands You, Not Just Your Data
        </Text>
        <Text style={styles.subtitle}>
          We go beyond step counters and calorie logs. AddAction offers
          context-aware health coaching, habit support, and real-time insights
          — like a wellness team in your pocket.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
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
    position: 'relative',
    alignItems: 'center',
  },
  imageGlow: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.6,
    borderRadius: 24,
    top: 20,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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
