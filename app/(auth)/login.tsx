// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

// Color palette matching the Next.js design
const Colors = {
  white: '#FFFFFF',
  blue: {
    200: '#BFDBFE',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
  },
  indigo: {
    700: '#4338CA',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    900: '#0F172A',
  },
  red: {
    50: '#FEF2F2',
    200: '#FECACA',
    600: '#DC2626',
  },
};

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { width } = useWindowDimensions(); // ✅ Reactive to screen changes

  const isTablet = width >= 768;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
      // ✅ redirect handled by AuthContext
    } catch (err: any) {
      const data = err.response?.data;
      setErrorMsg(data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => router.push('/')}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Main Card - Dynamic flexDirection based on screen width */}
            <View
              style={[
                styles.card,
                { flexDirection: isTablet ? 'row' : 'column' },
              ]}
            >
              {/* Form Section */}
              <View style={styles.formSection}>
                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity
                    style={styles.logoContainer}
                    onPress={() => router.push('/')}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[Colors.blue[600], Colors.blue[500]]}
                      style={styles.logoIcon}
                    >
                      <Ionicons name="heart" size={20} color={Colors.white} />
                    </LinearGradient>
                    <Text style={styles.logoText}>CarePair</Text>
                  </TouchableOpacity>

                  <Text style={styles.title}>Welcome back</Text>
                  <Text style={styles.subtitle}>
                    Don't have an account?{' '}
                    <Text
                      style={styles.linkText}
                      onPress={() => router.push('/(auth)/signup')}
                    >
                      Create one for free
                    </Text>
                  </Text>
                </View>

                {/* Error Message */}
                {errorMsg ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                  </View>
                ) : null}

                {/* Form */}
                <View style={styles.form}>
                  {/* Email Input */}
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={Colors.slate[400]}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email Address"
                      placeholderTextColor={Colors.slate[400]}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                    />
                  </View>

                  {/* Password Input */}
                  <View style={[styles.inputContainer, styles.inputSpacing]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color={Colors.slate[400]}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor={Colors.slate[400]}
                      secureTextEntry={!showPassword}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={Colors.slate[400]}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      styles.inputSpacing,
                      isLoading && styles.submitButtonDisabled,
                    ]}
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
                          <Text style={styles.submitText}>Sign In</Text>
                          <Ionicons
                            name="arrow-forward"
                            size={20}
                            color={Colors.white}
                            style={styles.submitIcon}
                          />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <View style={styles.footerDivider} />
                  <View style={styles.footerContent}>
                    <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color={Colors.slate[400]}
                    />
                    <Text style={styles.footerText}>
                      SECURE ENTERPRISE-GRADE ENCRYPTION
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right Side - Decorative Panel (visible on tablets/large screens) */}
              {isTablet && (
                <LinearGradient
                  colors={[Colors.blue[600], Colors.indigo[700]]}
                  style={styles.decorativePanel}
                >
                  <View style={styles.decorativeContent}>
                    <View style={styles.decorativeIconContainer}>
                      <Ionicons name="key-outline" size={32} color={Colors.white} />
                    </View>
                    <Text style={styles.decorativeTitle}>
                      Your journey to{'\n'}
                      <Text style={styles.decorativeTitleHighlight}>
                        mental wellness
                      </Text>
                      {'\n'}continues here.
                    </Text>
                  </View>

                  <View style={styles.quoteCard}>
                    <Text style={styles.quoteText}>
                      "Healing takes courage, and we all have courage, even if we
                      have to dig a little to find it."
                    </Text>
                    <View style={styles.quoteAuthor}>
                      <View style={styles.authorAvatar} />
                      <View style={styles.authorInfo}>
                        <Text style={styles.authorName}>Tori Amos</Text>
                        <Text style={styles.authorTitle}>Mental Health Advocate</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.15,
    shadowRadius: 50,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  formSection: {
    flex: 1,
    padding: 32,
    paddingVertical: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  header: {
    marginBottom: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.slate[900],
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.slate[900],
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.slate[500],
  },
  linkText: {
    color: Colors.blue[600],
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: Colors.red[50],
    borderWidth: 1,
    borderColor: Colors.red[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  errorText: {
    color: Colors.red[600],
    fontSize: 14,
  },
  form: {
    // Removed gap - using marginTop on children instead
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 2,
    borderColor: Colors.slate[100],
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputSpacing: {
    marginTop: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.slate[900],
  },
  eyeButton: {
    padding: 4,
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.blue[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
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
  },
  submitText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  submitIcon: {
    marginLeft: 8,
  },
  footer: {
    marginTop: 40,
  },
  footerDivider: {
    height: 1,
    backgroundColor: Colors.slate[100],
    marginBottom: 24,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate[400],
    letterSpacing: 2,
    marginLeft: 12,
  },
  // Decorative Panel Styles (for tablets)
  decorativePanel: {
    flex: 1,
    padding: 48,
    justifyContent: 'space-between',
    minHeight: 500,
  },
  decorativeContent: {
    flex: 1,
  },
  decorativeIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  decorativeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    lineHeight: 44,
  },
  decorativeTitleHighlight: {
    color: Colors.blue[200],
  },
  quoteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quoteText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 16,
    lineHeight: 26,
  },
  quoteAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.blue[400],
  },
  authorInfo: {
    marginLeft: 12,
  },
  authorName: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  authorTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
});