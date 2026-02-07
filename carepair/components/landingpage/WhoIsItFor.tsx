// components/landingpage/WhoIsItFor.tsx
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

interface AudienceItem {
  category: string;
  title: string;
  description: string;
  imageUrl: any;
  badge: string;
}

const targetAudience: AudienceItem[] = [
  {
    category: 'Individuals',
    title: 'Seeking Support',
    description:
      "People navigating life's challenges who need a safe space to talk and professional guidance to find their peace.",
    imageUrl: require('../../assets/images/home/companion.png'),
    badge: 'Patient',
  },
  {
    category: 'Specialists',
    title: 'Health Professionals',
    description:
      'Licensed therapists looking to expand their practice, manage appointments, and connect with patients seamlessly.',
    imageUrl: require('../../assets/images/home/doctor1.jpg'),
    badge: 'Therapist',
  },
  {
    category: 'Corporate',
    title: 'Busy Professionals',
    description:
      'High-performers dealing with stress, burnout, or work-life balance who require flexible, remote mental health support.',
    imageUrl: require('../../assets/images/home/insights.png'),
    badge: 'Workplace',
  },
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

const AudienceCard = ({
  item,
  index,
  scrollY,
}: {
  item: AudienceItem;
  index: number;
  scrollY: number;
}) => {
  return (
    <AnimateOnScroll direction="up" delay={index * 150} scrollY={scrollY}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {item.imageUrl ? (
            <Image
              source={item.imageUrl}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.cardImage, styles.imagePlaceholder]}>
              <Ionicons
                name={
                  item.badge === 'Patient'
                    ? 'person'
                    : item.badge === 'Therapist'
                    ? 'medical'
                    : 'briefcase'
                }
                size={60}
                color={`${Colors.blue[400]}80`}
              />
            </View>
          )}
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.badge}>{item.badge}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <View style={styles.decorativeLine} />
        </View>
      </View>
    </AnimateOnScroll>
  );
};

interface WhoIsItForProps {
  scrollY?: number;
}

const WhoIsItFor = ({ scrollY = 0 }: WhoIsItForProps) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <AnimateOnScroll direction="up" delay={0} scrollY={scrollY}>
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>AUDIENCE</Text>
          </View>
          <Text style={styles.title}>Who is Carepair For?</Text>
          <Text style={styles.subtitle}>
            Whether you're looking for guidance or providing it—Carepair meets
            you where you are with professional tools and compassionate care.
          </Text>
        </View>
      </AnimateOnScroll>

      {/* Audience Cards */}
      <View style={styles.cardsContainer}>
        {targetAudience.map((item, index) => (
          <AudienceCard key={index} item={item} index={index} scrollY={scrollY} />
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
    marginBottom: 40,
  },
  headerBadge: {
    backgroundColor: Colors.blue[50],
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  headerBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.blue[600],
    letterSpacing: 2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.slate[900],
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.slate[600],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.9,
  },
  cardsContainer: {
    gap: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 220,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.slate[100],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: Colors.blue[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.15)',
  },
  cardContent: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  badge: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.blue[600],
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: Colors.slate[600],
    lineHeight: 24,
    marginBottom: 20,
  },
  decorativeLine: {
    height: 4,
    width: 0,
    backgroundColor: Colors.blue[600],
    borderRadius: 2,
  },
});

export default WhoIsItFor;