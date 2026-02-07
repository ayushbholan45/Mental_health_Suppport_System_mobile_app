/**
 * Patient Drawer/Sidebar Navigation
 * 
 * Full sidebar that opens from the LEFT on dashboard pages
 * Replicates the web app's Sidebar.tsx exactly
 * 
 * Contains:
 * - Main navigation (Dashboard, Appointments, Find Therapist)
 * - Resources (Articles, Quizzes, Flashcards)
 * - Tools (Messages, Journal, Medications, Care Plan)
 * - Bottom items (Profile, Settings, Support)
 * 
 * IMPORTANT: Opens from LEFT side (like web app sidebar)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  iconLibrary: 'ionicons' | 'material';
  href: string;
}

const mainNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'home',
    iconLibrary: 'ionicons',
    href: '/patient/dashboard',
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: 'calendar',
    iconLibrary: 'ionicons',
    href: '/patient/appointments',
  },
  {
    id: 'therapists',
    label: 'Find Therapist',
    icon: 'people',
    iconLibrary: 'ionicons',
    href: '/patient/find-therapist',
  },
];

const resourceNavItems: NavItem[] = [
  {
    id: 'articles',
    label: 'Articles',
    icon: 'book',
    iconLibrary: 'ionicons',
    href: '/patient/articles',
  },
  {
    id: 'quizzes',
    label: 'Quizzes',
    icon: 'brain',
    iconLibrary: 'material',
    href: '/patient/quizzes',
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    icon: 'document-text',
    iconLibrary: 'ionicons',
    href: '/patient/flashcards',
  },
];

const toolsNavItems: NavItem[] = [
  {
    id: 'messages',
    label: 'Messages',
    icon: 'chatbubbles',
    iconLibrary: 'ionicons',
    href: '/patient/messages',
  },
  {
    id: 'journal',
    label: 'Journal',
    icon: 'heart',
    iconLibrary: 'ionicons',
    href: '/patient/journal',
  },
  {
    id: 'medications',
    label: 'Medications',
    icon: 'medkit',
    iconLibrary: 'ionicons',
    href: '/patient/medications',
  },
  {
    id: 'care-plan',
    label: 'Care Plan',
    icon: 'clipboard',
    iconLibrary: 'ionicons',
    href: '/patient/care-plan',
  },
];

const bottomNavItems: NavItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: 'person',
    iconLibrary: 'ionicons',
    href: '/patient/profile',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    iconLibrary: 'ionicons',
    href: '/patient/settings',
  },
  {
    id: 'support',
    label: 'Support',
    icon: 'help-circle',
    iconLibrary: 'ionicons',
    href: '/patient/support',
  },
];

interface NavSectionProps {
  title?: string;
  items: NavItem[];
  onNavigate?: () => void;
}

function NavSection({ title, items, onNavigate }: NavSectionProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (href: string) => {
    router.push(href as any);
    onNavigate?.();
  };

  return (
    <View style={styles.section}>
      {title && <Text style={styles.sectionTitle}>{title}</Text>}
      <View style={styles.navList}>
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => handlePress(item.href)}
              activeOpacity={0.7}
            >
              {item.iconLibrary === 'ionicons' ? (
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={isActive ? '#FFFFFF' : '#6B7280'}
                />
              ) : (
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={20}
                  color={isActive ? '#FFFFFF' : '#6B7280'}
                />
              )}
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

interface PatientDrawerProps {
  onNavigate?: () => void;
}

export default function PatientDrawer({ onNavigate }: PatientDrawerProps) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo - Links to patient home page */}
      <TouchableOpacity
        style={styles.logoContainer}
        onPress={() => {
          router.push('/patient/home');
          onNavigate?.();
        }}
        activeOpacity={0.8}
      >
        <View style={styles.logoBox}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.logoText}>CarePair</Text>
      </TouchableOpacity>

      {/* Scrollable Navigation */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.navContainer}>
          <NavSection items={mainNavItems} onNavigate={onNavigate} />
          <NavSection
            title="RESOURCES"
            items={resourceNavItems}
            onNavigate={onNavigate}
          />
          <NavSection
            title="TOOLS"
            items={toolsNavItems}
            onNavigate={onNavigate}
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavSection items={bottomNavItems} onNavigate={onNavigate} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  navContainer: {
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  navList: {
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },
  navLabelActive: {
    color: '#FFFFFF',
  },
  bottomNav: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
});