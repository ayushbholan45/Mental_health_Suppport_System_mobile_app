import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';

// User interface to match AuthContext
interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  redirect_url: string;
  [key: string]: any;
}

const { width } = Dimensions.get('window');

// User Icon
const UserIcon = ({ size = 24, color = '#2563EB' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </Svg>
);

// Bell Icon
const BellIcon = ({ size = 24, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Clipboard Check Icon
const ClipboardCheckIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 2h6v4H9z" />
    <Path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Users Icon
const UsersIcon = ({ size = 16, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
    <Path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Settings Icon
const SettingsIcon = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </Svg>
);

// Logout Icon
const LogoutIcon = ({ size = 16, color = '#DC2626' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Menu Icon
const MenuIcon = ({ size = 24, color = '#374151' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Close Icon
const CloseIcon = ({ size = 24, color = '#374151' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Logo Plus Icon
const LogoPlusIcon = ({ size = 24, color = '#FFFFFF' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
    <Path d="M12 2v20M2 12h20" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Get auth state from context
  const { user, isAuthenticated, logout } = useAuth();
  const userRole = user?.role as 'patient' | 'therapist' | 'admin' | undefined;

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      setIsProfileMenuOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  // Navigation links based on auth state and role
  const getNavLinks = () => {
    const baseLinks = [
      { label: 'Home', href: '/' },
      { label: 'Blogs', href: '/blog' },
    ];

    if (!isAuthenticated) {
      return [...baseLinks, { label: 'Support', href: '/support' }];
    }

    if (userRole === 'therapist') {
      return [
        { label: 'Home', href: '/' },
        { label: 'My Blogs', href: '/therapist/my-blogs' },
        { label: 'Blogs', href: '/blog' },
        { label: 'Appointments', href: '/therapist/appointments' },
        { label: 'Support', href: '/support' },
      ];
    }

    if (userRole === 'patient') {
      return [...baseLinks, { label: 'Support', href: '/support' }];
    }

    return [...baseLinks, { label: 'Support', href: '/support' }];
  };

  const navLinks = getNavLinks();

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        {/* Logo */}
        <TouchableOpacity
          style={styles.logo}
          onPress={() => {
            router.push('/');
            setIsMobileMenuOpen(false);
          }}
        >
          <View style={styles.logoIcon}>
            <LogoPlusIcon size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>CarePair</Text>
        </TouchableOpacity>

        {/* Desktop Navigation - Hidden on mobile */}
        {width >= 768 && (
          <View style={styles.desktopNav}>
            {navLinks.map((link) => (
              <TouchableOpacity
                key={link.label}
                onPress={() => router.push(link.href)}
                style={styles.navLink}
              >
                <Text style={styles.navLinkText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Right Section */}
        <View style={styles.rightSection}>
          {!isAuthenticated ? (
            // Auth Buttons
            <>
              {width >= 768 && (
                <TouchableOpacity
                  onPress={() => router.push('/auth/login')}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
              )}
              {width >= 768 && (
                <TouchableOpacity
                  onPress={() => router.push('/auth/signup')}
                  style={styles.signupButton}
                >
                  <Text style={styles.signupButtonText}>Sign up</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            // User Section
            <>
              {/* Role-specific buttons */}
              {userRole === 'patient' && width >= 768 && (
                <>
                  <TouchableOpacity
                    onPress={() => router.push('/patient/dashboard')}
                    style={styles.dashboardButton}
                  >
                    <Text style={styles.dashboardButtonText}>Dashboard</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push('/patient/assessment')}
                    style={styles.assessmentButton}
                  >
                    <ClipboardCheckIcon size={16} color="#FFFFFF" />
                    <Text style={styles.assessmentButtonText}>Take Assessment</Text>
                  </TouchableOpacity>
                </>
              )}

              {userRole === 'therapist' && width >= 768 && (
                <TouchableOpacity
                  onPress={() => router.push('/my-patients')}
                  style={styles.assessmentButton}
                >
                  <UsersIcon size={16} color="#FFFFFF" />
                  <Text style={styles.assessmentButtonText}>My Patients</Text>
                </TouchableOpacity>
              )}

              {/* Notifications */}
              {width >= 768 && (
                <TouchableOpacity style={styles.notificationButton}>
                  <BellIcon size={24} color="#6B7280" />
                  <View style={styles.notificationDot} />
                </TouchableOpacity>
              )}

              {/* Profile Button */}
              {width >= 768 && (
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <View style={styles.profileAvatar}>
                    <UserIcon size={24} color="#2563EB" />
                  </View>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Mobile Menu Button */}
          {width < 768 && (
            <TouchableOpacity
              style={styles.mobileMenuButton}
              onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <CloseIcon size={24} color="#374151" />
              ) : (
                <MenuIcon size={24} color="#374151" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Mobile Menu */}
      <Modal
        visible={isMobileMenuOpen && width < 768}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMobileMenuOpen(false)}
      >
        <View style={styles.mobileMenuOverlay}>
          <View style={styles.mobileMenu}>
            {/* Close Button */}
            <View style={styles.mobileMenuHeader}>
              <Text style={styles.mobileMenuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setIsMobileMenuOpen(false)}>
                <CloseIcon size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.mobileMenuContent}>
              {/* Navigation Links */}
              {navLinks.map((link) => (
                <TouchableOpacity
                  key={link.label}
                  onPress={() => {
                    router.push(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  style={styles.mobileNavLink}
                >
                  <Text style={styles.mobileNavLinkText}>{link.label}</Text>
                </TouchableOpacity>
              ))}

              {/* Auth Buttons or User Actions */}
              {!isAuthenticated ? (
                <View style={styles.mobileAuthButtons}>
                  <TouchableOpacity
                    onPress={() => {
                      router.push('/auth/login');
                      setIsMobileMenuOpen(false);
                    }}
                    style={styles.mobileLoginButton}
                  >
                    <Text style={styles.mobileLoginButtonText}>Login</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      router.push('/auth/signup');
                      setIsMobileMenuOpen(false);
                    }}
                    style={styles.mobileSignupButton}
                  >
                    <Text style={styles.mobileSignupButtonText}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.mobileUserActions}>
                  <TouchableOpacity
                    onPress={() => {
                      router.push(
                        userRole === 'therapist' ? '/therapist/profile' : '/patient/profile'
                      );
                      setIsMobileMenuOpen(false);
                    }}
                    style={styles.mobileActionButton}
                  >
                    <UserIcon size={16} color="#374151" />
                    <Text style={styles.mobileActionButtonText}>Profile</Text>
                  </TouchableOpacity>

                  {userRole === 'patient' && (
                    <TouchableOpacity
                      onPress={() => {
                        router.push('/patient/assessment');
                        setIsMobileMenuOpen(false);
                      }}
                      style={styles.mobileActionButton}
                    >
                      <ClipboardCheckIcon size={16} color="#2563EB" />
                      <Text style={styles.mobileActionButtonTextBlue}>Take Assessment</Text>
                    </TouchableOpacity>
                  )}

                  {userRole === 'therapist' && (
                    <TouchableOpacity
                      onPress={() => {
                        router.push('/my-patients');
                        setIsMobileMenuOpen(false);
                      }}
                      style={styles.mobileActionButton}
                    >
                      <UsersIcon size={16} color="#2563EB" />
                      <Text style={styles.mobileActionButtonTextBlue}>My Patients</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={handleLogout}
                    style={styles.mobileLogoutButton}
                  >
                    <LogoutIcon size={16} color="#DC2626" />
                    <Text style={styles.mobileLogoutButtonText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Desktop Profile Dropdown */}
      {isProfileMenuOpen && width >= 768 && (
        <View style={styles.profileDropdown}>
          <View style={styles.profileDropdownHeader}>
            <Text style={styles.profileDropdownLabel}>Signed in as</Text>
            <Text style={styles.profileDropdownName} numberOfLines={1}>
              {user?.full_name || user?.email || 'User'}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              router.push(userRole === 'therapist' ? '/therapist/profile' : '/patient/profile');
              setIsProfileMenuOpen(false);
            }}
            style={styles.dropdownItem}
          >
            <UserIcon size={16} color="#374151" />
            <Text style={styles.dropdownItemText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push('/settings');
              setIsProfileMenuOpen(false);
            }}
            style={styles.dropdownItem}
          >
            <SettingsIcon size={16} color="#374151" />
            <Text style={styles.dropdownItemText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={styles.dropdownItemLogout}>
            <LogoutIcon size={16} color="#DC2626" />
            <Text style={styles.dropdownItemTextRed}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 80,
    maxWidth: 1280,
    marginHorizontal: 'auto',
    width: '100%',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  navLink: {
    paddingVertical: 8,
  },
  navLinkText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  loginButton: {
    paddingVertical: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  signupButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dashboardButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dashboardButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  assessmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  assessmentButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileMenuButton: {
    padding: 8,
  },
  mobileMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  mobileMenu: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  mobileMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  mobileMenuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  mobileMenuContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  mobileNavLink: {
    paddingVertical: 16,
  },
  mobileNavLinkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  mobileAuthButtons: {
    marginTop: 24,
    gap: 12,
  },
  mobileLoginButton: {
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
  },
  mobileLoginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  mobileSignupButton: {
    paddingVertical: 12,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    alignItems: 'center',
  },
  mobileSignupButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mobileUserActions: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  mobileActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  mobileActionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  mobileActionButtonTextBlue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  mobileLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  mobileLogoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
  profileDropdown: {
    position: 'absolute',
    top: 80,
    right: 24,
    width: 192,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  profileDropdownHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    marginBottom: 4,
  },
  profileDropdownLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  profileDropdownName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  dropdownItemLogout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  dropdownItemTextRed: {
    fontSize: 14,
    color: '#DC2626',
  },
});