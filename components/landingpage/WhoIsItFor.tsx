// components/landingpage/WhoIsItFor.tsx
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
      'People navigating life\'s challenges who need a safe space to talk and professional guidance to find their peace.',
    // Replace with your actual image: require('../../assets/images/doc1.jpeg'),
    imageUrl: null,
    badge: 'Patient',
  },
  {
    category: 'Specialists',
    title: 'Health Professionals',
    description:
      'Licensed therapists looking to expand their practice, manage appointments, and connect with patients seamlessly.',
    // Replace with your actual image: require('../../assets/images/doc1.jpeg'),
    imageUrl: null,
    badge: 'Therapist',
  },
  {
    category: 'Corporate',
    title: 'Busy Professionals',
    description:
      'High-performers dealing with stress, burnout, or work-life balance who require flexible, remote mental health support.',
    // Replace with your actual image: require('../../assets/images/doc1.jpeg'),
    imageUrl: null,
    badge: 'Workplace',
  },
];

const AudienceCard: React.FC<{ item: AudienceItem; index: number }> = ({
  item,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: index * 150,
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
      {/* Image Container */}
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
              name={item.badge === 'Patient' ? 'person' : item.badge === 'Therapist' ? 'medical' : 'briefcase'} 
              size={60} 
              color={`${Colors.blue[400]}80`} 
            />
          </View>
        )}
        {/* Overlay Gradient */}
        <View style={styles.imageOverlay} />
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.badge}>{item.badge}</Text>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>

        {/* Decorative Line */}
        <View style={styles.decorativeLine} />
      </View>
    </Animated.View>
  );
};

const WhoIsItFor: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>AUDIENCE</Text>
        </View>
        <Text style={styles.title}>Who is MentalSathi For?</Text>
        <Text style={styles.subtitle}>
          Whether you're looking for guidance or providing it—MentalSathi meets
          you where you are with professional tools and compassionate care.
        </Text>
      </View>

      {/* Audience Cards */}
      <View style={styles.cardsContainer}>
        {targetAudience.map((item, index) => (
          <AudienceCard key={index} item={item} index={index} />
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
