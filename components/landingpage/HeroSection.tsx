// components/landingpage/HeroSection.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface HeroSectionProps {
  onGetMatched?: () => void;
  onLearnMore?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetMatched, onLearnMore }) => {
  // Animation values
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Float animation 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -15,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Float animation 2 (offset)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -20,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[Colors.blue[50], Colors.blue[100], Colors.blue[200]]}
      style={styles.container}
    >
      {/* Animated Decorative Elements */}
      <View style={styles.decorationsContainer}>
        <Animated.View
          style={[
            styles.decoration,
            styles.heartDecoration,
            { transform: [{ translateY: floatAnim1 }] },
          ]}
        >
          <Ionicons name="heart" size={40} color={`${Colors.blue[300]}66`} />
        </Animated.View>

        <Animated.View
          style={[
            styles.decoration,
            styles.brainDecoration,
            { transform: [{ translateY: floatAnim2 }] },
          ]}
        >
          <Ionicons name="fitness" size={50} color={`${Colors.blue[400]}4D`} />
        </Animated.View>

        <Animated.View
          style={[
            styles.decoration,
            styles.plusDecoration,
            { transform: [{ translateY: floatAnim1 }] },
          ]}
        >
          <Ionicons name="add-circle" size={35} color={`${Colors.blue[300]}59`} />
        </Animated.View>

        <Animated.View
          style={[
            styles.pulsingCircle,
            { transform: [{ scale: pulseAnim }] },
          ]}
        />

        <Animated.View
          style={[
            styles.decoration,
            styles.smallHeart,
            { transform: [{ translateY: floatAnim2 }] },
          ]}
        >
          <Ionicons name="heart" size={28} color={`${Colors.blue[200]}66`} />
        </Animated.View>
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
          },
        ]}
      >
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>OUR PURPOSE</Text>
        </View>

        <Text style={styles.heading}>
          Join CarePair &{'\n'}
          Shape The{'\n'}
          Future of Health
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onGetMatched}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Matched</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onLearnMore}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>Learn how it works</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.scrollIndicator}>
          <Text style={styles.scrollText}>Scroll Down</Text>
          <Ionicons name="chevron-down" size={20} color={Colors.slate[600]} />
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height * 0.85,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  decorationsContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  decoration: {
    position: 'absolute',
  },
  heartDecoration: {
    top: 60,
    left: 20,
  },
  brainDecoration: {
    top: 80,
    right: 30,
  },
  plusDecoration: {
    bottom: 150,
    left: 30,
  },
  pulsingCircle: {
    position: 'absolute',
    top: '45%',
    right: 50,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${Colors.blue[300]}4D`,
  },
  smallHeart: {
    top: '35%',
    left: '20%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  tagContainer: {
    alignSelf: 'flex-start',
    backgroundColor: `${Colors.white}CC`,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    marginBottom: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.slate[700],
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.slate[900],
    lineHeight: 44,
    marginBottom: 32,
  },
  buttonsContainer: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: Colors.blue[600],
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: `${Colors.white}CC`,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  secondaryButtonText: {
    color: Colors.slate[900],
    fontSize: 16,
    fontWeight: '600',
  },
  scrollIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  scrollText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.slate[600],
  },
});

export default HeroSection;