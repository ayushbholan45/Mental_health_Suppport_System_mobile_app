// app/(auth)/signup.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

type UserRole = 'patient' | 'therapist';

interface FormData {
  email: string;
  password: string;
  password2: string;
  full_name: string;
  phone_number: string;
  date_of_birth: string;
  gender: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  basic_health_info: string;
  terms_accepted: boolean;
  profession_type: string;
  license_id: string;
  years_of_experience: string;
}

const FormInput: React.FC<{
  name: string;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date';
  value: string;
  onChangeText: (name: string, value: string) => void;
  secureTextEntry?: boolean;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
}> = ({
  name,
  placeholder,
  icon,
  type = 'text',
  value,
  onChangeText,
  secureTextEntry = false,
  rightIcon,
  multiline = false,
  numberOfLines = 1,
}) => {
  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'tel':
        return 'phone-pad';
      case 'number':
        return 'numeric';
      default:
        return 'default';
    }
  };

  return (
    <View style={[styles.inputContainer, multiline && styles.inputContainerMultiline]}>
      <Ionicons
        name={icon}
        size={20}
        color={Colors.slate[400]}
        style={[styles.inputIcon, multiline && styles.inputIconMultiline]}
      />
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        placeholderTextColor={Colors.slate[400]}
        value={value}
        onChangeText={(text) => onChangeText(name, text)}
        keyboardType={getKeyboardType()}
        autoCapitalize={type === 'email' ? 'none' : 'words'}
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {rightIcon}
    </View>
  );
};

const SelectInput: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
}> = ({ icon, placeholder, value, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View>
      <TouchableOpacity
        style={styles.selectContainer}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Ionicons name={icon} size={20} color={Colors.slate[400]} style={styles.inputIcon} />
        <Text style={[styles.selectText, !value && styles.selectPlaceholder]}>
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.slate[400]}
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                value === option.value && styles.optionItemSelected,
              ]}
              onPress={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  value === option.value && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {value === option.value && (
                <Ionicons name="checkmark" size={18} color={Colors.blue[600]} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<UserRole>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    password2: '',
    full_name: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    basic_health_info: '',
    terms_accepted: false,
    profession_type: '',
    license_id: '',
    years_of_experience: '',
  });

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const professionOptions = [
    { label: 'Psychologist', value: 'psychologist' },
    { label: 'Psychiatrist', value: 'psychiatrist' },
    { label: 'Counselor', value: 'counselor' },
    { label: 'Therapist', value: 'therapist' },
    { label: 'Social Worker', value: 'social_worker' },
  ];

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const validateForm = (): boolean => {
    if (!formData.full_name || !formData.email || !formData.phone_number) {
      setErrorMsg('Please fill in all required fields');
      return false;
    }

    if (!formData.password || !formData.password2) {
      setErrorMsg('Please enter a password');
      return false;
    }

    if (formData.password !== formData.password2) {
      setErrorMsg('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setErrorMsg('Password must be at least 8 characters');
      return false;
    }

    if (!formData.gender) {
      setErrorMsg('Please select your gender');
      return false;
    }

    if (role === 'patient' && !formData.terms_accepted) {
      setErrorMsg('Please accept the terms and conditions');
      return false;
    }

    if (role === 'therapist') {
      if (!formData.profession_type) {
        setErrorMsg('Please select your profession type');
        return false;
      }
      if (!formData.license_id) {
        setErrorMsg('Please enter your license ID');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setErrorMsg('');

    try {
      if (role === 'patient') {
        const patientPayload = {
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          basic_health_info: formData.basic_health_info,
          terms_accepted: formData.terms_accepted,
        };
        await register('patient', patientPayload);
      } else {
        const therapistPayload = {
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          profession_type: formData.profession_type,
          license_id: formData.license_id,
          years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : 0,
        };
        await register('therapist', therapistPayload);
      }
      // Navigation is handled by AuthContext
    } catch (err: any) {
      console.log('Full Error Object:', err);
      const errorData = err.response?.data;
      let message = 'Registration failed. Please try again.';
      if (errorData) {
        const firstErrorKey = Object.keys(errorData)[0];
        const firstErrorMessage = errorData[firstErrorKey];
        message = Array.isArray(firstErrorMessage) ? firstErrorMessage[0] : firstErrorMessage;
        if (errorData.error) message = errorData.error;
        if (errorData.detail) message = errorData.detail;
      }
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.bgDecoration1} />
          <View style={styles.bgDecoration2} />

          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.slate[600]} />
          </TouchableOpacity>

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.logoContainer}
              onPress={() => router.push('/')}
            >
              <LinearGradient
                colors={[Colors.blue[600], Colors.blue[500]]}
                style={styles.logoIcon}
              >
                <Ionicons name="heart" size={20} color={Colors.white} />
              </LinearGradient>
              <Text style={styles.logoText}>CarePair</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Already have an account?{' '}
              <Text
                style={styles.linkText}
                onPress={() => router.push('/(auth)/login')}
              >
                Log in
              </Text>
            </Text>
          </View>

          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'patient' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('patient')}
            >
              <Ionicons
                name="heart"
                size={22}
                color={role === 'patient' ? Colors.blue[600] : Colors.slate[500]}
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'patient' && styles.roleTextActive,
                ]}
              >
                Patient
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                role === 'therapist' && styles.roleButtonActive,
              ]}
              onPress={() => setRole('therapist')}
            >
              <Ionicons
                name="briefcase"
                size={22}
                color={role === 'therapist' ? Colors.blue[600] : Colors.slate[500]}
              />
              <Text
                style={[
                  styles.roleText,
                  role === 'therapist' && styles.roleTextActive,
                ]}
              >
                Therapist
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <FormInput
              name="full_name"
              placeholder="Full Name"
              icon="person-outline"
              value={formData.full_name}
              onChangeText={handleInputChange}
            />

            <FormInput
              name="email"
              placeholder="Email Address"
              icon="mail-outline"
              type="email"
              value={formData.email}
              onChangeText={handleInputChange}
            />

            <FormInput
              name="phone_number"
              placeholder="Phone Number"
              icon="call-outline"
              type="tel"
              value={formData.phone_number}
              onChangeText={handleInputChange}
            />

            <FormInput
              name="date_of_birth"
              placeholder="Date of Birth (YYYY-MM-DD)"
              icon="calendar-outline"
              value={formData.date_of_birth}
              onChangeText={handleInputChange}
            />

            <SelectInput
              icon="people-outline"
              placeholder="Select Gender"
              value={formData.gender}
              options={genderOptions}
              onSelect={(value) => handleInputChange('gender', value)}
            />

            {role === 'patient' && (
              <>
                <FormInput
                  name="emergency_contact_name"
                  placeholder="Emergency Contact Name"
                  icon="person-outline"
                  value={formData.emergency_contact_name}
                  onChangeText={handleInputChange}
                />

                <FormInput
                  name="emergency_contact_phone"
                  placeholder="Emergency Contact Phone"
                  icon="call-outline"
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChangeText={handleInputChange}
                />

                <FormInput
                  name="basic_health_info"
                  placeholder="Basic Health Information (optional)"
                  icon="document-text-outline"
                  value={formData.basic_health_info}
                  onChangeText={handleInputChange}
                  multiline
                  numberOfLines={3}
                />
              </>
            )}

            {role === 'therapist' && (
              <>
                <SelectInput
                  icon="briefcase-outline"
                  placeholder="Select Profession Type"
                  value={formData.profession_type}
                  options={professionOptions}
                  onSelect={(value) => handleInputChange('profession_type', value)}
                />

                <FormInput
                  name="license_id"
                  placeholder="License ID"
                  icon="ribbon-outline"
                  value={formData.license_id}
                  onChangeText={handleInputChange}
                />

                <FormInput
                  name="years_of_experience"
                  placeholder="Years of Experience"
                  icon="book-outline"
                  type="number"
                  value={formData.years_of_experience}
                  onChangeText={handleInputChange}
                />
              </>
            )}

            <View style={styles.passwordRow}>
              <View style={styles.passwordField}>
                <FormInput
                  name="password"
                  placeholder="Password"
                  icon="lock-closed-outline"
                  value={formData.password}
                  onChangeText={handleInputChange}
                  secureTextEntry={!showPassword}
                />
              </View>
              <View style={styles.passwordField}>
                <FormInput
                  name="password2"
                  placeholder="Confirm"
                  icon="lock-closed-outline"
                  value={formData.password2}
                  onChangeText={handleInputChange}
                  secureTextEntry={!showPassword}
                  rightIcon={
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={Colors.slate[400]}
                      />
                    </TouchableOpacity>
                  }
                />
              </View>
            </View>

            <View style={styles.passwordRequirements}>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={formData.password.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={formData.password.length >= 8 ? Colors.teal[500] : Colors.slate[400]}
                />
                <Text
                  style={[
                    styles.requirementText,
                    formData.password.length >= 8 && styles.requirementMet,
                  ]}
                >
                  At least 8 characters
                </Text>
              </View>
              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    formData.password === formData.password2 && formData.password.length > 0
                      ? 'checkmark-circle'
                      : 'ellipse-outline'
                  }
                  size={16}
                  color={
                    formData.password === formData.password2 && formData.password.length > 0
                      ? Colors.teal[500]
                      : Colors.slate[400]
                  }
                />
                <Text
                  style={[
                    styles.requirementText,
                    formData.password === formData.password2 &&
                      formData.password.length > 0 &&
                      styles.requirementMet,
                  ]}
                >
                  Passwords match
                </Text>
              </View>
            </View>

            {role === 'patient' && (
              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => handleInputChange('terms_accepted', !formData.terms_accepted)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.checkbox,
                    formData.terms_accepted && styles.checkboxChecked,
                  ]}
                >
                  {formData.terms_accepted && (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  )}
                </View>
                <Text style={styles.termsText}>
                  I accept the{' '}
                  <Text style={styles.termsLink}>Terms and Conditions</Text>
                  {' '}and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.blue[600], Colors.blue[500]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <>
                    <Text style={styles.submitText}>
                      Create {role} account
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={Colors.white} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <LinearGradient
                colors={[Colors.blue[500], Colors.purple[500]]}
                style={styles.infoCardIcon}
              >
                <Ionicons name="sparkles" size={24} color={Colors.white} />
              </LinearGradient>
              <View>
                <Text style={styles.infoCardTitle}>CarePair Platform</Text>
                <Text style={styles.infoCardSubtitle}>Mental Health Support</Text>
              </View>
            </View>
            <Text style={styles.infoCardQuote}>
              "Our mission is to bridge the gap between mental health professionals
              and those seeking support through a seamless, secure, and user-friendly
              digital interface."
            </Text>

            <View style={styles.featureRow}>
              <View style={styles.featureItem}>
                <Ionicons name="shield-checkmark" size={20} color={Colors.blue[600]} />
                <Text style={styles.featureTitle}>Secure Data</Text>
                <Text style={styles.featureDesc}>Encrypted profiles</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.teal[600]} />
                <Text style={styles.featureTitle}>Verified Roles</Text>
                <Text style={styles.featureDesc}>Licensed therapists</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.slate[400]} />
            <Text style={styles.footerText}>SECURE ENTERPRISE-GRADE ENCRYPTION</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    position: 'relative',
  },
  bgDecoration1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: `${Colors.blue[400]}15`,
  },
  bgDecoration2: {
    position: 'absolute',
    bottom: 100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: `${Colors.purple[500]}15`,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.slate[900],
    marginLeft: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.slate[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.slate[600],
  },
  linkText: {
    color: Colors.blue[600],
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    flex: 1,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.slate[200],
    backgroundColor: Colors.white,
  },
  roleButtonActive: {
    borderColor: Colors.blue[600],
    backgroundColor: Colors.blue[50],
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.slate[600],
  },
  roleTextActive: {
    color: Colors.blue[600],
  },
  form: {
    gap: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.slate[200],
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  inputContainerMultiline: {
    height: 100,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputIconMultiline: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.slate[900],
  },
  inputMultiline: {
    height: '100%',
    textAlignVertical: 'top',
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.slate[200],
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: Colors.slate[900],
  },
  selectPlaceholder: {
    color: Colors.slate[400],
  },
  optionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: Colors.slate[200],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  optionItemSelected: {
    backgroundColor: Colors.blue[50],
  },
  optionText: {
    fontSize: 14,
    color: Colors.slate[700],
  },
  optionTextSelected: {
    color: Colors.blue[600],
    fontWeight: '600',
  },
  passwordRow: {
    flexDirection: 'row',
    gap: 12,
  },
  passwordField: {
    flex: 1,
  },
  eyeButton: {
    padding: 4,
  },
  passwordRequirements: {
    gap: 6,
    marginTop: 4,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requirementText: {
    fontSize: 12,
    color: Colors.slate[400],
  },
  requirementMet: {
    color: Colors.teal[600],
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.slate[300],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.blue[600],
    borderColor: Colors.blue[600],
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: Colors.slate[600],
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.blue[600],
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  submitText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    marginTop: 32,
    shadowColor: Colors.slate[200],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.slate[100],
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.slate[900],
  },
  infoCardSubtitle: {
    fontSize: 13,
    color: Colors.slate[500],
  },
  infoCardQuote: {
    fontSize: 14,
    color: Colors.slate[700],
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureItem: {
    flex: 1,
    backgroundColor: Colors.slate[50],
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.slate[100],
  },
  featureTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.slate[900],
    marginTop: 8,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 11,
    color: Colors.slate[500],
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate[400],
    letterSpacing: 1.5,
  },
});