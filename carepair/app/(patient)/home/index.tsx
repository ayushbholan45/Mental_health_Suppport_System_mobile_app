/**
 * Patient Home Page - Landing page shown after patient login
 * 
 * Features:
 * - RIGHT drawer with simple menu (Features, How It Works, Pricing, Dashboard, Logout)
 * - Matches the web app's landing page exactly
 * - Hamburger menu at TOP RIGHT opens the drawer from RIGHT
 * 
 * IMPORTANT: This is the LANDING PAGE, not the dashboard
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import PatientLandingMenu from '@/components/patient/PatientLandingMenu';

const { width } = Dimensions.get('window');

interface FeatureCard {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  color: string;
  features: string[];
}

interface StepCard {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  color: string;
}

interface QuickAccessCard {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  route: string;
  color: string;
  bgColor: string;
}

export default function PatientHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [scrollY] = useState(new Animated.Value(0));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Section refs for scrolling
  const featuresRef = useRef<View>(null);
  const howItWorksRef = useRef<View>(null);

  // Extract first name from full_name
  const firstName = user?.full_name?.split(' ')[0] || 'there';

  // Header opacity animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const quickAccessCards: QuickAccessCard[] = [
    {
      icon: 'calendar-outline',
      title: 'Appointments',
      desc: 'View & Schedule',
      route: '/patient/appointments',
      color: '#2563EB',
      bgColor: '#EFF6FF',
    },
    {
      icon: 'chatbubble-outline',
      title: 'Messages',
      desc: 'Chat with therapist',
      route: '/patient/messages',
      color: '#6366F1',
      bgColor: '#EEF2FF',
    },
    {
      icon: 'book-outline',
      title: 'Journal',
      desc: 'Daily reflections',
      route: '/patient/journal',
      color: '#A855F7',
      bgColor: '#FAF5FF',
    },
    {
      icon: 'fitness-outline',
      title: 'Care Plan',
      desc: 'Your exercises',
      route: '/patient/care-plan',
      color: '#EC4899',
      bgColor: '#FDF2F8',
    },
  ];

  const features: FeatureCard[] = [
    {
      icon: 'brain',
      title: 'AI-Powered Insights',
      color: '#A855F7',
      features: [
        'Real-time mood tracking',
        'Behavioral pattern analysis',
        'Personalized recommendations',
      ],
    },
    {
      icon: 'account-group',
      title: 'Expert Therapists',
      color: '#2563EB',
      features: [
        'Licensed professionals',
        '94% match success rate',
        'Specialized care approaches',
      ],
    },
    {
      icon: 'shield-check',
      title: 'Secure & Private',
      color: '#06B6D4',
      features: [
        'HIPAA compliant platform',
        'End-to-end encryption',
        'Your data is protected',
      ],
    },
  ];

  const steps: StepCard[] = [
    {
      icon: 'person-outline',
      title: 'Complete Profile',
      desc: 'Tell us about your needs and preferences',
      color: '#2563EB',
    },
    {
      icon: 'sync-outline',
      title: 'Get Matched',
      desc: 'AI finds your perfect therapist match',
      color: '#6366F1',
    },
    {
      icon: 'calendar-outline',
      title: 'Book Session',
      desc: 'Schedule at your convenience',
      color: '#A855F7',
    },
    {
      icon: 'trending-up-outline',
      title: 'Track Progress',
      desc: 'Monitor and celebrate your growth',
      color: '#EC4899',
    },
  ];

  // Handle scroll to section
  const handleScrollToSection = (section: string) => {
    // For now just close the drawer
    // You can implement scroll to section if needed
    console.log('Scroll to:', section);
  };

  const MainContent = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          {
            backgroundColor: headerOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', '#FFFFFF'],
            }),
            borderBottomWidth: headerOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </View>
            <TouchableOpacity onPress={() => router.push('/')}>
              <Text style={styles.logoText}>CarePair</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            {/* Hamburger Menu - Opens Drawer from RIGHT */}
            <TouchableOpacity
              style={styles.hamburgerBtn}
              onPress={() => setDrawerOpen(true)}
            >
              <Ionicons name="menu" size={28} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.welcomeBadge}>
            <Ionicons name="sparkles" size={16} color="#2563EB" />
            <Text style={styles.welcomeBadgeText}>
              Welcome Back, {firstName}!
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            Your Mental Health Journey Starts{' '}
            <Text style={styles.heroTitleGradient}>Here</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Access your personalized dashboard to connect with your therapist,
            track your progress, and continue your journey toward wellness.
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push('/patient/dashboard')}
            >
              <Text style={styles.primaryBtnText}>Access Dashboard</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push('/patient/appointments')}
            >
              <Text style={styles.secondaryBtnText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
              </View>
              <Text style={styles.statText}>Account Active</Text>
            </View>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#2563EB" />
              </View>
              <Text style={styles.statText}>HIPAA Compliant</Text>
            </View>
          </View>
        </View>

        {/* Personalized Care Card */}
        <View style={styles.careCard}>
          <Text style={styles.careCardTitle}>Your Personalized Care</Text>

          <TouchableOpacity
            style={styles.careCardItem}
            onPress={() => router.push('/patient/appointments')}
          >
            <View style={styles.careCardIconBox}>
              <Ionicons name="calendar" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.careCardContent}>
              <Text style={styles.careCardItemTitle}>Next Session</Text>
              <Text style={styles.careCardItemSubtitle}>
                Schedule your appointment
              </Text>
              <Text style={styles.careCardItemDesc}>
                Connect with your matched therapist
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.careCardItem}
            onPress={() => router.push('/patient/dashboard')}
          >
            <View style={styles.careCardIconBox}>
              <Ionicons name="bar-chart" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.careCardContent}>
              <Text style={styles.careCardItemTitle}>Track Progress</Text>
              <Text style={styles.careCardItemSubtitle}>
                View your wellness insights
              </Text>
              <Text style={styles.careCardItemDesc}>
                Monitor your mental health journey
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.care24}>
            <Ionicons name="time-outline" size={20} color="#BFDBFE" />
            <Text style={styles.care24Text}>24/7 access to your care tools</Text>
          </View>
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickAccessGrid}>
            {quickAccessCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickCard, { backgroundColor: card.bgColor }]}
                onPress={() => router.push(card.route as any)}
              >
                <View style={[styles.quickCardIcon, { backgroundColor: card.color }]}>
                  <Ionicons name={card.icon} size={28} color="#FFFFFF" />
                </View>
                <Text style={styles.quickCardTitle}>{card.title}</Text>
                <Text style={styles.quickCardDesc}>{card.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={[styles.section, styles.featuresSection]} ref={featuresRef}>
          <Text style={styles.sectionTitle}>
            Everything You Need for{' '}
            <Text style={styles.sectionTitleGradient}>Your Wellness</Text>
          </Text>
          <Text style={styles.sectionSubtitle}>
            CarePair provides comprehensive tools and support for your mental health
            journey
          </Text>

          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                <MaterialCommunityIcons
                  name={feature.icon}
                  size={32}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              {feature.features.map((item, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color={feature.color} />
                  <Text style={styles.featureItemText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* How It Works Section */}
        <View style={styles.section} ref={howItWorksRef}>
          <Text style={styles.sectionTitle}>Getting Started is Easy</Text>
          <Text style={styles.sectionSubtitle}>
            Your personalized wellness journey in simple steps
          </Text>

          {steps.map((step, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: step.color }]}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={[styles.stepIconBox, { backgroundColor: `${step.color}20` }]}>
                <Ionicons name={step.icon} size={32} color={step.color} />
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          ))}
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Continue Your Journey?</Text>
          <Text style={styles.ctaSubtitle}>
            Access your personalized dashboard and take the next step toward wellness
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => router.push('/patient/dashboard')}
          >
            <Text style={styles.ctaBtnText}>Go to Dashboard</Text>
            <Ionicons name="arrow-forward" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerBrand}>
              <View style={styles.footerLogoBox}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.footerBrandText}>CarePair</Text>
            </View>
            <Text style={styles.footerTagline}>
              Your mental health journey, supported every step of the way.
            </Text>
            <Text style={styles.footerCopyright}>
              © 2024 CarePair. All rights reserved.
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );

  // Right-side drawer (slides in from the RIGHT) - Simple menu
  return (
    <View style={{ flex: 1 }}>
      {drawerOpen && (
        <TouchableOpacity
          style={styles.drawerOverlay}
          activeOpacity={1}
          onPress={() => setDrawerOpen(false)}
        >
          <View style={styles.drawerSpacer} />
          <TouchableOpacity
            style={styles.drawerContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <PatientLandingMenu 
              onNavigate={() => setDrawerOpen(false)}
              onClose={() => setDrawerOpen(false)}
              onScrollToSection={handleScrollToSection}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
      <MainContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  drawerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    flexDirection: 'row',
  },
  drawerSpacer: {
    flex: 1,
  },
  drawerContent: {
    width: 280,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    borderBottomColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  welcomeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 20,
  },
  welcomeBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
    lineHeight: 44,
  },
  heroTitleGradient: {
    color: '#2563EB',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 24,
  },
  heroButtons: {
    gap: 12,
    marginBottom: 24,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  quickStats: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  careCard: {
    marginHorizontal: 20,
    backgroundColor: '#2563EB',
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  careCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  careCardItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    gap: 16,
  },
  careCardIconBox: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  careCardContent: {
    flex: 1,
  },
  careCardItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  careCardItemSubtitle: {
    fontSize: 13,
    color: '#BFDBFE',
    marginBottom: 4,
  },
  careCardItemDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  care24: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  care24Text: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitleGradient: {
    color: '#2563EB',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    width: (width - 52) / 2,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  quickCardDesc: {
    fontSize: 13,
    color: '#64748B',
  },
  featuresSection: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 32,
    marginHorizontal: 0,
    paddingHorizontal: 20,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  featureItemText: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepIconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  ctaSection: {
    marginHorizontal: 20,
    backgroundColor: '#2563EB',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  ctaBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  footer: {
    backgroundColor: '#1F2937',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  footerLogoBox: {
    width: 36,
    height: 36,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBrandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  footerTagline: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});