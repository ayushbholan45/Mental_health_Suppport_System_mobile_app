// components/landingpage/CareOptions.tsx
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
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const { width, height: screenHeight } = Dimensions.get('window');

interface CareOption {
  title: string;
  desc: string;
  color: string;
  textColor: string;
  tag?: string;
}

const careOptions: CareOption[] = [
  {
    title: 'Psychiatry',
    desc: 'The right prescription medication for you.',
    color: Colors.blue[100],
    textColor: Colors.blue[700],
  },
  {
    title: 'Therapy',
    desc: "Care proven to help with life's challenges.",
    color: Colors.orange[100],
    textColor: Colors.orange[700],
  },
  {
    title: 'Psychiatry + Therapy',
    desc: 'Prescription medication and therapy support.',
    color: Colors.teal[100],
    textColor: Colors.teal[700],
    tag: 'Most Common',
  },
  {
    title: 'Teen Care',
    desc: 'Therapy for teens, with medication if appropriate.',
    color: Colors.green[100],
    textColor: Colors.green[700],
    tag: 'Ages 13+',
  },
];

const benefits = [
  'Appointments in as little as 2 days',
  'Medicare and Medicaid accepted',
  'Free assessment and recommendation',
];

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

const CareOptionCard = ({
  option,
  index,
  scrollY,
}: {
  option: CareOption;
  index: number;
  scrollY: number;
}) => {
  return (
    <AnimateOnScroll direction="up" delay={index * 100} scrollY={scrollY}>
      <View style={styles.card}>
        <View style={[styles.cardHeader, { backgroundColor: option.color }]}>
          {option.tag && (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{option.tag}</Text>
            </View>
          )}
          <View style={[styles.cardIcon, { borderColor: option.textColor }]} />
          <Text style={[styles.cardTitle, { color: option.textColor }]}>
            {option.title}
          </Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardDesc}>{option.desc}</Text>
          <TouchableOpacity style={styles.learnMoreBtn}>
            <Text style={styles.learnMoreText}>Learn more</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.blue[600]} />
          </TouchableOpacity>
        </View>
      </View>
    </AnimateOnScroll>
  );
};

interface CareOptionsProps {
  scrollY?: number;
}

const CareOptions = ({ scrollY = 0 }: CareOptionsProps) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <AnimateOnScroll direction="up" delay={0} scrollY={scrollY}>
        <View style={styles.header}>
          <Text style={styles.sectionLabel}>OUR CARE OPTIONS</Text>
          <Text style={styles.title}>
            Affordable help, with or without insurance
          </Text>
          <Text style={styles.subtitle}>
            Get started with a free assessment, and we'll match you with a
            personalized plan.
          </Text>
        </View>
      </AnimateOnScroll>

      {/* Care Options Grid */}
      <View style={styles.optionsGrid}>
        {careOptions.map((option, index) => (
          <CareOptionCard key={index} option={option} index={index} scrollY={scrollY} />
        ))}
      </View>

      {/* CTA Section */}
      <AnimateOnScroll direction="up" delay={100} scrollY={scrollY}>
        <View style={styles.ctaSection}>
          <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
            <Text style={styles.ctaButtonText}>START WITH A FREE ASSESSMENT</Text>
          </TouchableOpacity>

          <View style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={Colors.teal[500]}
                />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      </AnimateOnScroll>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.slate[100],
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.blue[600],
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.slate[900],
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.slate[500],
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsGrid: {
    gap: 16,
    marginBottom: 40,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.slate[100],
  },
  cardHeader: {
    padding: 24,
    height: 140,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  tagBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: `${Colors.white}CC`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate[600],
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    opacity: 0.4,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  cardBody: {
    padding: 24,
  },
  cardDesc: {
    fontSize: 15,
    color: Colors.slate[500],
    lineHeight: 22,
    marginBottom: 16,
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  learnMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.blue[600],
  },
  ctaSection: {
    alignItems: 'center',
  },
  ctaButton: {
    backgroundColor: Colors.blue[600],
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: Colors.teal[200],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  ctaButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  benefitsContainer: {
    gap: 12,
    alignItems: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.slate[600],
  },
});

export default CareOptions;