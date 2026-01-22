// components/landingpage/TherapistsSection.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 300;
const CARD_GAP = 16;

interface Therapist {
  id: number;
  name: string;
  title: string;
  specialties: string[];
  image: any;
}

const therapists: Therapist[] = [
  {
    id: 1,
    name: 'Dr. Alisha Verma',
    title: 'Clinical Psychologist',
    specialties: ['Anxiety & Depression', 'Trauma', 'CBT'],
    // Replace with: require('../../assets/images/doctor1.jpg'),
    image: null,
  },
  {
    id: 2,
    name: 'Mr. Rahul Sharma',
    title: 'Licensed MFT',
    specialties: ['Relationship Issues', 'Family Dynamics', 'Couples Therapy'],
    // Replace with: require('../../assets/images/doctor2.webp'),
    image: null,
  },
  {
    id: 3,
    name: 'Dr. Priya Desai',
    title: 'Psychiatrist',
    specialties: ['Medication Management', 'Mood Disorders', 'ADHD'],
    // Replace with: require('../../assets/images/doctor3.webp'),
    image: null,
  },
  {
    id: 4,
    name: 'Dr. Marcus Cole',
    title: 'Behavioral Therapist',
    specialties: ['Addiction Recovery', 'Habit Breaking', 'Mindfulness'],
    // Replace with: require('../../assets/images/doctor7.jpg'),
    image: null,
  },
  {
    id: 5,
    name: 'Ms. Sarah Jenkins',
    title: 'Child Psychologist',
    specialties: ['Adolescent Issues', 'Learning Disabilities', 'Play Therapy'],
    // Replace with: require('../../assets/images/doctor4.jpeg'),
    image: null,
  },
  {
    id: 6,
    name: 'Dr. Omar Hassan',
    title: 'Trauma Specialist',
    specialties: ['PTSD', 'EMDR', 'Grief Counseling'],
    // Replace with: require('../../assets/images/doctor7.avif'),
    image: null,
  },
];

const getTagStyle = (index: number) => {
  const styles = [
    { bg: Colors.teal[50], text: Colors.teal[700], border: Colors.teal[100] },
    { bg: Colors.indigo[50], text: Colors.indigo[700], border: Colors.indigo[100] },
    { bg: Colors.sky[50], text: Colors.sky[700], border: Colors.sky[100] },
  ];
  return styles[index % styles.length];
};

const TherapistCard: React.FC<{
  therapist: Therapist;
  index: number;
}> = ({ therapist, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: (index % 3) * 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: (index % 3) * 150,
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
      {/* Image */}
      <View style={styles.imageContainer}>
        {therapist.image ? (
          <Image
            source={therapist.image}
            style={styles.therapistImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.therapistImage, styles.imagePlaceholder]}>
            <Ionicons name="person" size={60} color={`${Colors.teal[500]}60`} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.therapistName}>{therapist.name}</Text>
        <Text style={styles.therapistTitle}>{therapist.title}</Text>

        {/* Specialties */}
        <View style={styles.specialtiesSection}>
          <Text style={styles.specialtiesLabel}>SPECIALTIES</Text>
          <View style={styles.tagsContainer}>
            {therapist.specialties.map((specialty, i) => {
              const tagStyle = getTagStyle(i);
              return (
                <View
                  key={i}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: tagStyle.bg,
                      borderColor: tagStyle.border,
                    },
                  ]}
                >
                  <Text style={[styles.tagText, { color: tagStyle.text }]}>
                    {specialty}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.viewProfileBtn}>
            <Text style={styles.viewProfileText}>View Profile</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={Colors.blue[500]}
            />
          </TouchableOpacity>

          <View style={styles.socialIcons}>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="logo-linkedin" size={20} color={Colors.slate[400]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <Ionicons name="chatbubble-outline" size={20} color={Colors.slate[400]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const TherapistsSection: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % therapists.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (CARD_WIDTH + CARD_GAP),
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_GAP));
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meet Our Compassionate Therapists</Text>
        <Text style={styles.subtitle}>
          Highly skilled professionals dedicated to providing personalized care.
          Slide to find the right match for your journey.
        </Text>
      </View>

      {/* Horizontal Scroll */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={handleScroll}
      >
        {therapists.map((therapist, index) => (
          <TherapistCard key={therapist.id} therapist={therapist} index={index} />
        ))}
      </ScrollView>

      {/* Scroll Indicators */}
      <View style={styles.indicators}>
        {therapists.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              scrollViewRef.current?.scrollTo({
                x: index * (CARD_WIDTH + CARD_GAP),
                animated: true,
              });
              setCurrentIndex(index);
            }}
            style={[
              styles.indicator,
              currentIndex === index && styles.indicatorActive,
            ]}
          />
        ))}
      </View>

      {/* View All Button */}
      <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.8}>
        <Text style={styles.viewAllText}>View All Therapists</Text>
        <Ionicons name="arrow-forward" size={20} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.slate[100],
    paddingVertical: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.slate[800],
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.slate[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.slate[100],
  },
  imageContainer: {
    height: 180,
    width: '100%',
    backgroundColor: Colors.slate[100],
  },
  therapistImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: Colors.teal[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  therapistName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.slate[800],
    marginBottom: 4,
  },
  therapistTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.teal[700],
    marginBottom: 16,
  },
  specialtiesSection: {
    marginBottom: 20,
  },
  specialtiesLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.slate[500],
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.slate[100],
  },
  viewProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.slate[700],
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialIcon: {
    padding: 4,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    marginBottom: 32,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.slate[300],
  },
  indicatorActive: {
    width: 32,
    backgroundColor: Colors.blue[600],
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue[600],
    marginHorizontal: 24,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    gap: 8,
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default TherapistsSection;
