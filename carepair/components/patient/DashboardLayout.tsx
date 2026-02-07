/**
 * Patient Dashboard Layout
 * 
 * Provides the drawer navigation for all patient dashboard pages.
 * Replicates the web app's sidebar layout EXACTLY.
 * 
 * IMPORTANT: Drawer slides from the LEFT (like web app sidebar)
 * 
 * Usage: Wrap your dashboard pages with this layout component
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import PatientDrawer from './PatientDrawer';

const { width } = Dimensions.get('window');

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Get page title from pathname
  const getPageTitle = () => {
    if (!pathname) return 'Dashboard';
    const pathParts = pathname.split('/').filter((part) => part !== '');
    const lastPart = pathParts[pathParts.length - 1] || 'dashboard';
    return lastPart
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const pageTitle = getPageTitle();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerOpen(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={24} color="#111827" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.breadcrumb}>
            User Portal / <Text style={styles.breadcrumbActive}>{pageTitle}</Text>
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>{children}</View>

      {/* Drawer Modal - Slides from LEFT */}
      <Modal
        visible={drawerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={styles.drawerContainer}>
          {/* Drawer (on the LEFT) */}
          <View style={styles.drawer}>
            <PatientDrawer onNavigate={() => setDrawerOpen(false)} />
          </View>

          {/* Overlay (on the right) */}
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
  },
  headerContent: {
    flex: 1,
  },
  breadcrumb: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  breadcrumbActive: {
    color: '#4B5563',
  },
  content: {
    flex: 1,
  },
  drawerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    width: width * 0.8,
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});