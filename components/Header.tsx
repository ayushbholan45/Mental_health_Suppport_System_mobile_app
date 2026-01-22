// components/Header.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet, 
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; //hey
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../constants/Colors';

type UserRole = 'patient' | 'therapist' | null;

interface User {
  email: string;
  full_name?: string;
  role: UserRole;
}

interface HeaderProps {
  // Pass these from your AuthContext or state management
  user?: User | null;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user = null,
  isAuthenticated = false,
  onLogout,
}) => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const userRole: UserRole = user?.role ?? null;

  // Determine home/dashboard link based on role
  const getHomeHref = (): string => {
    if (!isAuthenticated) return '/';
    if (userRole === 'patient') return '/patient/dashboard';
    if (userRole === 'therapist') return '/therapist/dashboard';
    return '/';
  };

  const getProfileHref = (): string => {
    if (userRole === 'therapist') return '/therapist/profile';
    if (userRole === 'patient') return '/patient/profile';
    return '/(auth)/login';
  };

  // Navigation links based on role
  const getNavLinks = () => {
    const base = [
      { label: 'Home', href: getHomeHref(), icon: 'home-outline' as const },
      { label: 'How it works', href: '/how-it-works', icon: 'help-circle-outline' as const },
      { label: 'Blog', href: '/blog', icon: 'newspaper-outline' as const },
    ];

    if (isAuthenticated) {
      if (userRole === 'patient') {
        return [
          ...base,
          { label: 'Find a therapist', href: '/find-therapist', icon: 'search-outline' as const },
          { label: 'Support', href: '/support', icon: 'chatbubbles-outline' as const },
        ];
      }

      if (userRole === 'therapist') {
        return [
          ...base,
          { label: 'Appointments', href: '/appointments', icon: 'calendar-outline' as const },
          { label: 'Support', href: '/support', icon: 'chatbubbles-outline' as const },
        ];
      }
    }

    return [...base, { label: 'Support', href: '/support', icon: 'chatbubbles-outline' as const }];
  };

  const navLinks = getNavLinks();

  const handleNavigation = (href: string) => {
    setMenuOpen(false);
    setProfileDropdownOpen(false);
    router.push(href as any);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    setProfileDropdownOpen(false);
    onLogout?.();
    router.replace('/');
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => handleNavigation(getHomeHref())}
        >
          <View style={styles.logoIcon}>
            <Ionicons name="add" size={24} color={Colors.white} />
          </View>
          <Text style={styles.logoText}>CarePair</Text>
        </TouchableOpacity>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          {isAuthenticated ? (
            <>
              {/* Role-specific buttons */}
              {userRole === 'patient' && (
                <TouchableOpacity
                  style={styles.assessmentButton}
                  onPress={() => handleNavigation('/patient/assessment')}
                >
                  <LinearGradient
                    colors={[Colors.blue[600], '#4f46e5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    <Ionicons name="clipboard-outline" size={16} color={Colors.white} />
                    <Text style={styles.assessmentButtonText}>Assessment</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {userRole === 'therapist' && (
                <TouchableOpacity
                  style={styles.assessmentButton}
                  onPress={() => handleNavigation('/my-patients')}
                >
                  <LinearGradient
                    colors={[Colors.blue[600], '#4f46e5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                  >
                    <Ionicons name="people-outline" size={16} color={Colors.white} />
                    <Text style={styles.assessmentButtonText}>Patients</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* Notifications */}
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={24} color={Colors.slate[500]} />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>

              {/* Profile Button */}
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => setProfileDropdownOpen(true)}
              >
                <View style={styles.profileAvatar}>
                  <Ionicons name="person" size={20} color={Colors.blue[700]} />
                </View>
                <Ionicons
                  name="chevron-down"
                  size={16}
                  color={Colors.slate[400]}
                />
              </TouchableOpacity>
            </>
          ) : null}

          {/* Mobile Menu Button */}
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setMenuOpen(true)}
          >
            <Ionicons name="menu" size={28} color={Colors.slate[700]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Dropdown Modal */}
      <Modal
        visible={profileDropdownOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setProfileDropdownOpen(false)}
      >
        <Pressable
          style={styles.dropdownOverlay}
          onPress={() => setProfileDropdownOpen(false)}
        >
          <View style={styles.profileDropdown}>
            {/* User Info */}
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownLabel}>Signed in as</Text>
              <Text style={styles.dropdownUserName} numberOfLines={1}>
                {user?.full_name || user?.email || 'User'}
              </Text>
            </View>

            {/* Dropdown Links */}
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleNavigation(getProfileHref())}
            >
              <Ionicons name="person-outline" size={18} color={Colors.slate[600]} />
              <Text style={styles.dropdownItemText}>My Profile</Text>
            </TouchableOpacity>

            {userRole === 'patient' && (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleNavigation('/patient/dashboard')}
              >
                <Ionicons name="grid-outline" size={18} color={Colors.slate[600]} />
                <Text style={styles.dropdownItemText}>Dashboard</Text>
              </TouchableOpacity>
            )}

            {userRole === 'therapist' && (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleNavigation('/therapist/dashboard')}
              >
                <Ionicons name="grid-outline" size={18} color={Colors.slate[600]} />
                <Text style={styles.dropdownItemText}>Dashboard</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => handleNavigation('/settings')}
            >
              <Ionicons name="settings-outline" size={18} color={Colors.slate[600]} />
              <Text style={styles.dropdownItemText}>Settings</Text>
            </TouchableOpacity>

            {/* Logout */}
            <View style={styles.dropdownDivider} />
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={18} color="#DC2626" />
              <Text style={[styles.dropdownItemText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Mobile Menu Modal */}
      <Modal
        visible={menuOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuOpen(false)}
        >
          <Pressable style={styles.menuContainer} onPress={() => {}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Menu Header */}
              <View style={styles.menuHeader}>
                <View style={styles.menuLogoContainer}>
                  <View style={styles.menuLogoIcon}>
                    <Ionicons name="add" size={20} color={Colors.white} />
                  </View>
                  <Text style={styles.menuLogoText}>CarePair</Text>
                </View>
                <TouchableOpacity onPress={() => setMenuOpen(false)}>
                  <Ionicons name="close" size={28} color={Colors.slate[700]} />
                </TouchableOpacity>
              </View>

              {/* User Info (if authenticated) */}
              {isAuthenticated && user && (
                <View style={styles.menuUserInfo}>
                  <View style={styles.menuUserAvatar}>
                    <Ionicons name="person" size={24} color={Colors.blue[700]} />
                  </View>
                  <View style={styles.menuUserDetails}>
                    <Text style={styles.menuUserName}>{user.full_name || 'User'}</Text>
                    <Text style={styles.menuUserEmail}>{user.email}</Text>
                    <View style={styles.menuUserBadge}>
                      <Text style={styles.menuUserBadgeText}>
                        {userRole === 'patient' ? 'Patient' : 'Therapist'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Navigation Links */}
              <View style={styles.menuLinks}>
                {navLinks.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.menuItem}
                    onPress={() => handleNavigation(item.href)}
                  >
                    <Ionicons name={item.icon} size={22} color={Colors.slate[600]} />
                    <Text style={styles.menuItemText}>{item.label}</Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.slate[400]} />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Auth Actions */}
              <View style={styles.menuActions}>
                {!isAuthenticated ? (
                  <>
                    <TouchableOpacity
                      style={styles.menuLoginButton}
                      onPress={() => handleNavigation('/(auth)/login')}
                    >
                      <Text style={styles.menuLoginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.menuSignupButton}
                      onPress={() => handleNavigation('/(auth)/signup')}
                    >
                      <LinearGradient
                        colors={[Colors.blue[600], Colors.blue[500]]}
                        style={styles.menuSignupGradient}
                      >
                        <Text style={styles.menuSignupButtonText}>Sign up</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* Role-specific CTA */}
                    {userRole === 'patient' && (
                      <TouchableOpacity
                        style={styles.menuCtaButton}
                        onPress={() => handleNavigation('/patient/assessment')}
                      >
                        <LinearGradient
                          colors={[Colors.blue[600], '#4f46e5']}
                          style={styles.menuCtaGradient}
                        >
                          <Ionicons name="clipboard-outline" size={20} color={Colors.white} />
                          <Text style={styles.menuCtaText}>Take Assessment</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}

                    {userRole === 'therapist' && (
                      <TouchableOpacity
                        style={styles.menuCtaButton}
                        onPress={() => handleNavigation('/my-patients')}
                      >
                        <LinearGradient
                          colors={[Colors.blue[600], '#4f46e5']}
                          style={styles.menuCtaGradient}
                        >
                          <Ionicons name="people-outline" size={20} color={Colors.white} />
                          <Text style={styles.menuCtaText}>My Patients</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}

                    {/* Profile & Settings */}
                    <TouchableOpacity
                      style={styles.menuSecondaryButton}
                      onPress={() => handleNavigation(getProfileHref())}
                    >
                      <Ionicons name="person-outline" size={20} color={Colors.slate[700]} />
                      <Text style={styles.menuSecondaryText}>My Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.menuSecondaryButton}
                      onPress={() => handleNavigation('/settings')}
                    >
                      <Ionicons name="settings-outline" size={20} color={Colors.slate[700]} />
                      <Text style={styles.menuSecondaryText}>Settings</Text>
                    </TouchableOpacity>

                    {/* Logout */}
                    <TouchableOpacity
                      style={styles.menuLogoutButton}
                      onPress={handleLogout}
                    >
                      <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                      <Text style={styles.menuLogoutText}>Logout</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.white,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.blue[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.slate[900],
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assessmentButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
  },
  assessmentButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.blue[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  menuButton: {
    padding: 8,
    marginLeft: 4,
  },

  // Profile Dropdown
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 16,
  },
  profileDropdown: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    overflow: 'hidden',
  },
  dropdownHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  dropdownLabel: {
    fontSize: 11,
    color: Colors.slate[400],
    fontWeight: '500',
    marginBottom: 2,
  },
  dropdownUserName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.slate[900],
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    color: Colors.slate[700],
    fontWeight: '500',
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: Colors.slate[100],
    marginVertical: 4,
  },
  logoutText: {
    color: '#DC2626',
  },

  // Mobile Menu Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  menuLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLogoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.blue[600],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  menuLogoText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.slate[900],
  },
  menuUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.slate[50],
    gap: 14,
  },
  menuUserAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.blue[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuUserDetails: {
    flex: 1,
  },
  menuUserName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 2,
  },
  menuUserEmail: {
    fontSize: 13,
    color: Colors.slate[500],
    marginBottom: 6,
  },
  menuUserBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.blue[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  menuUserBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.blue[700],
    textTransform: 'capitalize',
  },
  menuLinks: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.slate[700],
    marginLeft: 14,
  },
  menuActions: {
    paddingHorizontal: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.slate[100],
    marginTop: 8,
    gap: 12,
  },
  menuLoginButton: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.slate[100],
    alignItems: 'center',
  },
  menuLoginButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.slate[700],
  },
  menuSignupButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  menuSignupGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  menuSignupButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  menuCtaButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  menuCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  menuCtaText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  menuSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Colors.slate[50],
    borderRadius: 14,
    gap: 12,
  },
  menuSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.slate[700],
  },
  menuLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
    gap: 10,
    marginTop: 8,
  },
  menuLogoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
});

export default Header;