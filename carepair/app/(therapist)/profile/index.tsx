// app/(therapist)/profile/index.tsx
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
import { therapistAPI } from '../../../utils/api';
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
  profession_type: string;
  license_id: string;
  years_of_experience: number;
  bio: string;
  consultation_fees: string;
  consultation_mode: string;
  specialization_tags: string[];
  languages_spoken: string[];
  is_verified: boolean;
}

interface __Schedule__ {
  [key: string]: string[];
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TherapistProfile() {
  const [activeTab, setActiveTab] = useState('professional');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<any>(null);

  const [formData, setFormData] = useState<__FormData__>({
    full_name: '',
    email: '',
    phone_number: '',
    profession_type: 'therapist',
    license_id: '',
    years_of_experience: 0,
    bio: '',
    consultation_fees: '',
    consultation_mode: 'online',
    specialization_tags: [],
    languages_spoken: [],
    is_verified: false,
  });

  const [schedule, setSchedule] = useState<__Schedule__>({});
  const [newTag, setNewTag] = useState('');
  const [newLang, setNewLang] = useState('');

  const tabs: __TabItem__[] = [
    { id: 'professional', label: 'Basic Info', icon: 'person' },
    { id: 'practice', label: 'Clinical & Fees', icon: 'medical' },
    { id: 'expertise', label: 'Expertise', icon: 'globe' },
    { id: 'availability', label: 'Schedule', icon: 'time' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await therapistAPI.getProfile();

      setFormData({
        full_name: data.user?.full_name || '',
        email: data.user?.email || '',
        phone_number: data.phone_number || '',
        profession_type: data.profession_type || 'therapist',
        license_id: data.license_id || '',
        years_of_experience: data.years_of_experience || 0,
        bio: data.bio || '',
        consultation_fees: data.consultation_fees || '',
        consultation_mode: data.consultation_mode || 'online',
        specialization_tags: data.specialization_tags || [],
        languages_spoken: data.languages_spoken || [],
        is_verified: data.is_verified || false,
      });

      // Parse schedule
      if (data.availability_slots) {
        const parsed = typeof data.availability_slots === 'string' 
          ? JSON.parse(data.availability_slots)
          : data.availability_slots;
        setSchedule(parsed || {});
      }

      // Set profile picture
      if (data.profile_picture) {
        setProfileImage(data.profile_picture);
      }
    } catch (err: any) {
      setError('Failed to load profile details.');
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
      setImageFile({
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const dataToSend = new FormData();

      // Profile picture (only if new)
      if (imageFile) {
        dataToSend.append('profile_picture', imageFile as any);
      }

      // Standard fields
      dataToSend.append('phone_number', formData.phone_number);
      dataToSend.append('license_id', formData.license_id);
      dataToSend.append('years_of_experience', String(formData.years_of_experience));
      dataToSend.append('bio', formData.bio);
      dataToSend.append('consultation_fees', formData.consultation_fees);
      dataToSend.append('consultation_mode', formData.consultation_mode);
      dataToSend.append('specialization_tags', JSON.stringify(formData.specialization_tags));
      dataToSend.append('languages_spoken', JSON.stringify(formData.languages_spoken));
      dataToSend.append('availability_slots', JSON.stringify(schedule));

      await therapistAPI.updateProfile(dataToSend);
      
      Alert.alert('Success', 'Profile updated successfully!');
      await fetchProfile();
    } catch (err: any) {
      const errorData = err.response?.data;
      setError(
        errorData && Object.keys(errorData).length > 0
          ? JSON.stringify(errorData, null, 2)
          : err.message || 'Update failed. Please check your data.'
      );
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        specialization_tags: [...prev.specialization_tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialization_tags: prev.specialization_tags.filter((_, i) => i !== index),
    }));
  };

  const addLanguage = () => {
    if (newLang.trim()) {
      setFormData((prev) => ({
        ...prev,
        languages_spoken: [...prev.languages_spoken, newLang.trim()],
      }));
      setNewLang('');
    }
  };

  const removeLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      languages_spoken: prev.languages_spoken.filter((_, i) => i !== index),
    }));
  };

  const addTimeSlot = (day: string) => {
    const updated = {
      ...schedule,
      [day]: [...(schedule[day] || []), '09:00 - 10:00'],
    };
    setSchedule(updated);
  };

  const updateTimeSlot = (day: string, index: number, value: string) => {
    const updatedDay = [...(schedule[day] || [])];
    updatedDay[index] = value;
    setSchedule({ ...schedule, [day]: updatedDay });
  };

  const removeTimeSlot = (day: string, index: number) => {
    const updatedDay = (schedule[day] || []).filter((_, i) => i !== index);
    setSchedule({ ...schedule, [day]: updatedDay });
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
          <Text style={styles.title}>Professional Profile</Text>
          <Text style={styles.subtitle}>Update your clinical details and practice settings</Text>
        </View>

      {/* Error Alert */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={20} color="#b91c1c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.contentWrapper}>
        {/* Profile Card with Tabs */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>
                    {formData.full_name?.charAt(0) || 'T'}
                  </Text>
                </View>
              )}
              {formData.is_verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.blue[500]} />
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
            <Text style={styles.profileRole}>{formData.profession_type.toUpperCase()}</Text>
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
          {activeTab === 'professional' && (
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Professional Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.bio}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, bio: text }))
                  }
                  placeholder="Tell patients about your approach..."
                  placeholderTextColor={Colors.slate[400]}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone_number}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, phone_number: text }))
                  }
                  placeholder="Enter phone number"
                  placeholderTextColor={Colors.slate[400]}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Profession Type</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity style={styles.picker}>
                    <Text style={styles.pickerText}>
                      {formData.profession_type.charAt(0).toUpperCase() + formData.profession_type.slice(1)}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={Colors.slate[600]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'practice' && (
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Clinical Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>License ID</Text>
                <TextInput
                  style={styles.input}
                  value={formData.license_id}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, license_id: text }))
                  }
                  placeholder="Enter license ID"
                  placeholderTextColor={Colors.slate[400]}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Years of Experience</Text>
                <TextInput
                  style={styles.input}
                  value={String(formData.years_of_experience)}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, years_of_experience: parseInt(text) || 0 }))
                  }
                  placeholder="0"
                  placeholderTextColor={Colors.slate[400]}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Consultation Mode</Text>
                <View style={styles.pickerContainer}>
                  <TouchableOpacity style={styles.picker}>
                    <Text style={styles.pickerText}>
                      {formData.consultation_mode.charAt(0).toUpperCase() + formData.consultation_mode.slice(1)}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={Colors.slate[600]} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Consultation Fee ($)</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="cash" size={20} color={Colors.slate[400]} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { paddingLeft: 48 }]}
                    value={formData.consultation_fees}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, consultation_fees: text }))
                    }
                    placeholder="0"
                    placeholderTextColor={Colors.slate[400]}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          )}

          {activeTab === 'expertise' && (
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Expertise & Languages</Text>

              {/* Specializations */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Specializations</Text>
                <View style={styles.addItemContainer}>
                  <TextInput
                    style={styles.addItemInput}
                    value={newTag}
                    onChangeText={setNewTag}
                    placeholder="Add specialty..."
                    placeholderTextColor={Colors.slate[400]}
                  />
                  <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={addTag}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={24} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsContainer}>
                  {formData.specialization_tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                      <TouchableOpacity onPress={() => removeTag(index)}>
                        <Ionicons name="close" size={16} color={Colors.blue[700]} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>

              {/* Languages */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Languages Spoken</Text>
                <View style={styles.addItemContainer}>
                  <TextInput
                    style={styles.addItemInput}
                    value={newLang}
                    onChangeText={setNewLang}
                    placeholder="Add language..."
                    placeholderTextColor={Colors.slate[400]}
                  />
                  <TouchableOpacity 
                    style={styles.addButton} 
                    onPress={addLanguage}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={24} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.tagsContainer}>
                  {formData.languages_spoken.map((lang, index) => (
                    <View key={index} style={[styles.tag, styles.langTag]}>
                      <Text style={[styles.tagText, styles.langTagText]}>{lang}</Text>
                      <TouchableOpacity onPress={() => removeLanguage(index)}>
                        <Ionicons name="close" size={16} color={Colors.slate[700]} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'availability' && (
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Weekly Availability</Text>
              <Text style={styles.sectionSubtitle}>Set your recurring weekly consultation hours</Text>

              <View style={styles.scheduleContainer}>
                {DAYS_OF_WEEK.map((day) => (
                  <View key={day} style={styles.dayCard}>
                    <View style={styles.dayHeader}>
                      <View style={styles.dayTitleContainer}>
                        <Ionicons name="calendar" size={16} color={Colors.blue[500]} />
                        <Text style={styles.dayTitle}>{day}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.addSlotButton}
                        onPress={() => addTimeSlot(day)}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="add" size={16} color={Colors.blue[600]} />
                        <Text style={styles.addSlotText}>Add Slot</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.slotsContainer}>
                      {schedule[day] && schedule[day].length > 0 ? (
                        schedule[day].map((slot, index) => (
                          <View key={index} style={styles.slotItem}>
                            <TextInput
                              style={styles.slotInput}
                              value={slot}
                              onChangeText={(text) => updateTimeSlot(day, index, text)}
                              placeholder="e.g. 9:00 AM - 10:00 AM"
                              placeholderTextColor={Colors.slate[400]}
                            />
                            <TouchableOpacity
                              onPress={() => removeTimeSlot(day, index)}
                              style={styles.removeSlotButton}
                            >
                              <Ionicons name="close" size={16} color="#f87171" />
                            </TouchableOpacity>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noSlotsText}>No slots added for this day.</Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
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
                  <Text style={styles.saveButtonText}>
                    {saving ? 'Updating Profile...' : 'Save Changes'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.blue[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  cameraButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
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
    fontSize: 10,
    fontWeight: '700',
    color: Colors.blue[600],
    letterSpacing: 1,
  },
  tabsContainer: {
    gap: 4,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.slate[900],
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.slate[500],
    marginTop: -12,
    marginBottom: 8,
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
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: Colors.slate[200],
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  pickerText: {
    fontSize: 15,
    color: Colors.slate[900],
  },
  addItemContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addItemInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: Colors.slate[200],
    borderRadius: 12,
    fontSize: 15,
    color: Colors.slate[900],
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.blue[600],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.blue[50],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.blue[100],
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.blue[700],
  },
  langTag: {
    backgroundColor: Colors.slate[100],
    borderColor: Colors.slate[200],
  },
  langTagText: {
    color: Colors.slate[700],
  },
  scheduleContainer: {
    gap: 12,
  },
  dayCard: {
    padding: 16,
    backgroundColor: Colors.slate[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.slate[700],
  },
  addSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.blue[200],
  },
  addSlotText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.blue[600],
  },
  slotsContainer: {
    gap: 8,
  },
  slotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  slotInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.slate[600],
  },
  removeSlotButton: {
    padding: 4,
  },
  noSlotsText: {
    fontSize: 12,
    color: Colors.slate[400],
    fontStyle: 'italic',
  },
  actionButtons: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.slate[200],
  },
  saveButton: {
    flexDirection: 'row',
    paddingVertical: 16,
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
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});