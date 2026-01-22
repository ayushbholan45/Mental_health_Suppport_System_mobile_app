// components/landingpage/CareOptions.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

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
    desc: 'Care proven to help with life\'s challenges.',
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

const CareOptionCard: React.FC<{ option: CareOption; index: number }> = ({
  option,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Colored Header */}
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

      {/* Card Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardDesc}>{option.desc}</Text>
        <TouchableOpacity style={styles.learnMoreBtn}>
          <Text style={styles.learnMoreText}>Learn more</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.blue[600]} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const CareOptions: React.FC = () => {
  const ctaFadeAnim = useRef(new Animated.Value(0)).current;
  const ctaSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(ctaFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
      Animated.timing(ctaSlideAnim, {
        toValue: 0,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Care Options Grid */}
      <View style={styles.optionsGrid}>
        {careOptions.map((option, index) => (
          <CareOptionCard key={index} option={option} index={index} />
        ))}
      </View>

      {/* CTA Section */}
      <Animated.View
        style={[
          styles.ctaSection,
          {
            opacity: ctaFadeAnim,
            transform: [{ translateY: ctaSlideAnim }],
          },
        ]}
      >
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
          <Text style={styles.ctaButtonText}>START WITH A FREE ASSESSMENT</Text>
        </TouchableOpacity>

        {/* Benefits */}
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
      </Animated.View>
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
