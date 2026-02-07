import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Instagram Icon
const InstagramIcon = ({ size = 24, color = '#EC4899' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17.5 6.5h.01" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" />
  </Svg>
);

// Twitter Icon
const TwitterIcon = ({ size = 24, color = '#0EA5E9' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// LinkedIn Icon
const LinkedInIcon = ({ size = 24, color = '#2563EB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 9h4v12H2z" />
    <Path d="M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </Svg>
);

// Logo Plus Icon
const LogoPlusIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
    <Path d="M12 2v20M2 12h20" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

interface FooterSectionProps {
  scrollY?: number;
}

const FooterSection: React.FC<FooterSectionProps> = ({ scrollY }) => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const handleSocialPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.footer}>
      <View style={styles.container}>
        {/* Main Content Grid */}
        <View style={styles.grid}>
          {/* Brand & Socials */}
          <View style={styles.column}>
            <TouchableOpacity
              style={styles.brand}
              onPress={() => router.push('/')}
            >
              <View style={styles.logoIcon}>
                <LogoPlusIcon size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.logoText}>CarePair</Text>
            </TouchableOpacity>

            <View style={styles.socials}>
              <TouchableOpacity
                onPress={() => handleSocialPress('https://instagram.com')}
              >
                <InstagramIcon size={24} color="#EC4899" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSocialPress('https://twitter.com')}
              >
                <TwitterIcon size={24} color="#0EA5E9" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleSocialPress('https://linkedin.com')}
              >
                <LinkedInIcon size={24} color="#2563EB" />
              </TouchableOpacity>
            </View>

            <Text style={styles.tagline}>
              Your partner in mental wellness. Connecting you with compassionate care.
            </Text>
          </View>

          {/* Quick Links */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>QUICK LINKS</Text>
            <View style={styles.links}>
              <TouchableOpacity onPress={() => router.push('/')}>
                <Text style={styles.link}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/find-therapist')}>
                <Text style={styles.link}>Find a Therapist</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/support')}>
                <Text style={styles.link}>Support</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Learn & Grow */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>LEARN & GROW</Text>
            <View style={styles.links}>
              <TouchableOpacity onPress={() => router.push('/blogs')}>
                <Text style={styles.link}>Blog</Text>
              </TouchableOpacity>
              <View style={styles.linkWithBadge}>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.link}>Webinars</Text>
                </TouchableOpacity>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>New</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.link}>Case Studies</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.link}>Help Center</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Company */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>COMPANY</Text>
            <View style={styles.links}>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.link}>About Us</Text>
              </TouchableOpacity>
              <View style={styles.linkWithBadge}>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.link}>Careers</Text>
                </TouchableOpacity>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Hiring</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.link}>Partners</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.link}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <Text style={styles.copyright}>
            {`© ${currentYear} CarePair. All Rights Reserved.`}
          </Text>
          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={() => router.push('/privacy')}>
              <Text style={styles.legalLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/terms')}>
              <Text style={styles.legalLink}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/cookies')}>
              <Text style={styles.legalLink}>Cookie Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#E0E9F5',
    paddingTop: 64,
    paddingBottom: 32,
  },
  container: {
    maxWidth: 1280,
    marginHorizontal: 'auto',
    paddingHorizontal: 24,
    width: '100%',
  },
  grid: {
    flexDirection: width < 768 ? 'column' : 'row',
    flexWrap: width < 1024 ? 'wrap' : 'nowrap',
    gap: 48,
    marginBottom: 64,
  },
  column: {
    flex: width < 768 ? undefined : 1,
    minWidth: width < 768 ? '100%' : 200,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  socials: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  tagline: {
    fontSize: 14,
    color: '#64748B',
    maxWidth: 320,
    lineHeight: 22,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 1.5,
    marginBottom: 24,
  },
  links: {
    gap: 16,
  },
  link: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
    lineHeight: 24,
  },
  linkWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#2563EB',
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomBar: {
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#CBD5E1',
    flexDirection: width < 768 ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: width < 768 ? 'flex-start' : 'center',
    gap: 24,
  },
  copyright: {
    fontSize: 14,
    color: '#64748B',
  },
  legalLinks: {
    flexDirection: width < 768 ? 'column' : 'row',
    gap: width < 768 ? 16 : 32,
  },
  legalLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
});

// ✅ CRITICAL: Must use default export
export default FooterSection;