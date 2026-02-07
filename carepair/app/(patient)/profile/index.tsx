// app/(patient)/profile/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { patientAPI } from '../../../utils/api';
import Colors from '../../../constants/Colors';

interface __TabItem__ {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface __FormData__ {
  full_name: string;
  email: string;
  phone_number: string;
  date_of_birth: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  basic_health_info: string;
}

export default function PatientProfile() {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [formData, setFormData] = useState<__FormData__>({
    full_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    basic_health_info: '',
  });

  const tabs: __TabItem__[] = [
    { id: 'personal', label: 'Personal Info', icon: 'person' },
    { id: 'security', label: 'Security', icon: 'lock-closed' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'privacy', label: 'Privacy', icon: 'shield-checkmark' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await patientAPI.getProfile();

      setFormData({
        full_name: data.user.full_name || '',
        email: data.user.email || '',
        phone_number: data.user.phone_number || '',
        date_of_birth: data.user.date_of_birth || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
        basic_health_info: data.basic_health_info || '',
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to update your profile picture');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      await patientAPI.updateProfile({
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        basic_health_info: formData.basic_health_info,
      });
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err: any) {
      setError('Failed to update profile. Please check your connection.');
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue[600]} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          <Text style={styles.subtitle}>Manage your account settings and health information</Text>
        </View>

      {/* Error Alert */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#b91c1c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.contentWrapper}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {formData.full_name?.charAt(0) || 'U'}
                  </Text>
                </View>
              )}
              <TouchableOpacity 
                style={styles.cameraButton} 
                onPress={handlePickImage}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={16} color={Colors.slate[600]} />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{formData.full_name}</Text>
            <Text style={styles.profileRole}>Patient Account</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.tabButton,
                  activeTab === tab.id && styles.tabButtonActive,
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tab.icon}
                  size={18}
                  color={activeTab === tab.id ? Colors.blue[700] : Colors.slate[600]}
                />
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Content */}
        <View style={styles.formCard}>
          {activeTab === 'personal' && (
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <Text style={styles.sectionSubtitle}>Update your details and health contacts</Text>
              </View>

              {/* Full Name (Disabled) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person" size={20} color={Colors.slate[400]} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={formData.full_name}
                    editable={false}
                  />
                </View>
              </View>

              {/* Email (Disabled) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail" size={20} color={Colors.slate[400]} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={formData.email}
                    editable={false}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Phone (Disabled) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call" size={20} color={Colors.slate[400]} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputDisabled]}
                    value={formData.phone_number}
                    editable={false}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Emergency Contact Section */}
              <View style={styles.divider} />
              <Text style={styles.subsectionTitle}>Emergency Contact & Health</Text>

              {/* Emergency Contact Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.emergency_contact_name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, emergency_contact_name: text }))
                  }
                  placeholder="Enter contact name"
                  placeholderTextColor={Colors.slate[400]}
                />
              </View>

              {/* Emergency Contact Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Phone</Text>
                <TextInput
                  style={styles.input}
                  value={formData.emergency_contact_phone}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, emergency_contact_phone: text }))
                  }
                  placeholder="Enter contact phone"
                  placeholderTextColor={Colors.slate[400]}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Basic Health Info */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Basic Health Info</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.basic_health_info}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, basic_health_info: text }))
                  }
                  placeholder="Allergies, chronic conditions, etc."
                  placeholderTextColor={Colors.slate[400]}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}

          {activeTab === 'security' && (
            <View style={styles.emptyState}>
              <Ionicons name="lock-closed" size={48} color={Colors.slate[300]} />
              <Text style={styles.emptyStateText}>
                Security settings are managed by your account administrator.
              </Text>
            </View>
          )}

          {activeTab === 'notifications' && (
            <View style={styles.emptyState}>
              <Ionicons name="notifications" size={48} color={Colors.slate[300]} />
              <Text style={styles.emptyStateText}>
                Notification preferences coming soon.
              </Text>
            </View>
          )}

          {activeTab === 'privacy' && (
            <View style={styles.emptyState}>
              <Ionicons name="shield-checkmark" size={48} color={Colors.slate[300]} />
              <Text style={styles.emptyStateText}>
                Privacy settings coming soon.
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          {activeTab === 'personal' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={fetchProfile}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
                activeOpacity={0.7}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <>
                    <Ionicons name="save" size={20} color={Colors.white} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  container: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.slate[50],
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.slate[600],
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.slate[600],
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#b91c1c',
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[200],
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.blue[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.slate[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 12,
    color: Colors.slate[500],
  },
  tabsContainer: {
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  tabButtonActive: {
    backgroundColor: Colors.blue[50],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.slate[600],
  },
  tabTextActive: {
    color: Colors.blue[700],
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formSection: {
    gap: 20,
  },
  sectionHeader: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.slate[600],
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.slate[700],
  },
  inputContainer: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  input: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.slate[200],
    borderRadius: 12,
    fontSize: 15,
    color: Colors.slate[900],
    backgroundColor: Colors.white,
  },
  inputDisabled: {
    backgroundColor: Colors.slate[50],
    color: Colors.slate[500],
    paddingLeft: 48,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.slate[200],
    marginVertical: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.slate[800],
    marginBottom: 4,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 15,
    color: Colors.slate[500],
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.slate[200],
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.slate[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.slate[700],
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.blue[600],
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
});