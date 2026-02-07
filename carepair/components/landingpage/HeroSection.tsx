// components/landingpage/HeroSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

interface HeroSectionProps {
  onGetMatched?: () => void;
  onLearnMore?: () => void;
  scrollY?: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetMatched, onLearnMore, scrollY = 0 }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const menuItems = [
    { label: 'Features', action: () => console.log('Features') },
    { label: 'How It Works', action: () => console.log('How It Works') },
    { label: 'Therapists', action: () => console.log('Therapists') },
  ];

  return (
    <LinearGradient
      colors={[Colors.blue[50], Colors.blue[100], Colors.blue[200]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      {/* Header Navigation */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Ionicons name="add" size={24} color={Colors.white} />
            </View>
            <Text style={styles.logoText}>CarePair</Text>
          </View>

          {/* Right Side */}
          <View style={styles.headerRight}>
            {isAuthenticated ? (
              // My Account button when logged in
              <TouchableOpacity
                style={styles.myAccountButton}
                onPress={() => {
                  if (user?.role === 'patient') {
                    router.push('/(patient)/home');
                  } else if (user?.role === 'therapist') {
                    router.push('/(therapist)/dashboard');
                  }
                }}
              >
                <Ionicons name="person-circle" size={20} color={Colors.white} />
                <Text style={styles.myAccountText}>My Account</Text>
              </TouchableOpacity>
            ) : (
              // Login/Signup when not logged in (hidden on small screens)
              <>
                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <Text style={styles.loginText}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => router.push('/(auth)/signup')}
                >
                  <Text style={styles.signupText}>Sign Up</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Hamburger Menu */}
            <TouchableOpacity
              style={styles.hamburger}
              onPress={() => setMenuOpen(true)}
            >
              <Ionicons name="menu" size={28} color={Colors.slate[900]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

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

      {/* Mobile Menu Modal */}
      <Modal
        visible={menuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.mobileMenu}>
            <View style={styles.mobileMenuHeader}>
              <Text style={styles.mobileMenuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Ionicons name="close" size={28} color={Colors.slate[900]} />
              </TouchableOpacity>
            </View>

            <View style={styles.mobileMenuItems}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.mobileMenuItem}
                  onPress={() => {
                    item.action();
                    setMenuOpen(false);
                  }}
                >
                  <Text style={styles.mobileMenuText}>{item.label}</Text>
                </TouchableOpacity>
              ))}

              <View style={styles.mobileMenuDivider} />

              {!isAuthenticated && (
                <>
                  <TouchableOpacity
                    style={styles.mobileMenuItem}
                    onPress={() => {
                      router.push('/(auth)/login');
                      setMenuOpen(false);
                    }}
                  >
                    <Text style={styles.mobileMenuText}>Log In</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.mobileMenuItem, styles.mobileSignupButton]}
                    onPress={() => {
                      router.push('/(auth)/signup');
                      setMenuOpen(false);
                    }}
                  >
                    <Text style={styles.mobileSignupText}>Sign Up</Text>
                  </TouchableOpacity>
                </>
              )}

              {isAuthenticated && (
                <TouchableOpacity
                  style={[styles.mobileMenuItem, styles.mobileSignupButton]}
                  onPress={() => {
                    setMenuOpen(false);
                    if (user?.role === 'patient') {
                      router.push('/(patient)/home');
                    } else if (user?.role === 'therapist') {
                      router.push('/(therapist)/dashboard');
                    }
                  }}
                >
                  <Text style={styles.mobileSignupText}>My Account</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: Dimensions.get('window').height * 0.95,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: Colors.blue[600],
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.slate[900],
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loginButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    display: width < 500 ? 'none' : 'flex',
  },
  loginText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.slate[700],
  },
  signupButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.blue[600],
    borderRadius: 12,
    display: width < 500 ? 'none' : 'flex',
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  signupText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
  myAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.blue[600],
    borderRadius: 12,
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    display: width < 500 ? 'none' : 'flex',
  },
  myAccountText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
  hamburger: {
    padding: 4,
  },
  decorationsContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  decoration: {
    position: 'absolute',
  },
  heartDecoration: {
    top: 100,
    left: 20,
  },
  brainDecoration: {
    top: 120,
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
    paddingHorizontal: 24,
    paddingTop: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  mobileMenu: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  mobileMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[200],
  },
  mobileMenuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.slate[900],
  },
  mobileMenuItems: {
    padding: 20,
    gap: 4,
  },
  mobileMenuItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  mobileMenuText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.slate[700],
  },
  mobileMenuDivider: {
    height: 1,
    backgroundColor: Colors.slate[200],
    marginVertical: 12,
  },
  mobileSignupButton: {
    backgroundColor: Colors.blue[600],
    marginTop: 8,
  },
  mobileSignupText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});

export default HeroSection;