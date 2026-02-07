// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { tokenStorage } from '../utils/storage';
import {
  authAPI,
  PatientRegistrationData,
  TherapistRegistrationData,
  LoginData,
} from '../utils/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  redirect_url: string;
  [key: string]: any;
}

type UserRole = 'patient' | 'therapist';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (
    role: UserRole,
    data: PatientRegistrationData | TherapistRegistrationData
  ) => Promise<any>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to protect routes
function useProtectedRoute(user: User | null, loading: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inPatientGroup = segments[0] === '(patient)';
    const inTherapistGroup = segments[0] === '(therapist)';

    if (!user && (inPatientGroup || inTherapistGroup)) {
      // Not logged in but trying to access protected route
      router.replace('/(auth)/login');
    }
  }, [user, segments, loading]);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Protect routes based on auth state
  useProtectedRoute(user, loading);

  // Initialize authentication - simple version without navigation
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await tokenStorage.getAccessToken();
        if (token) {
          try {
            const userData = await authAPI.getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error('Failed to fetch user:', error);
            await tokenStorage.clearTokens();
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register function
  const register = async (
    role: UserRole,
    data: PatientRegistrationData | TherapistRegistrationData
  ) => {
    try {
      let response;
      if (role === 'patient') {
        response = await authAPI.registerPatient(data as PatientRegistrationData);
      } else {
        response = await authAPI.registerTherapist(data as TherapistRegistrationData);
      }

      // Store JWT tokens
      await tokenStorage.setTokens(response.tokens.access, response.tokens.refresh);

      // Set authenticated user
      setUser(response.user);

      // Navigate to appropriate page
      if (role === 'patient') {
        router.replace('/(patient)/home');
      } else {
        router.replace('/(therapist)/dashboard');
      }

      return response;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login function
  const login = async (data: LoginData) => {
    try {
      const response = await authAPI.login(data);
      
      // Store tokens
      await tokenStorage.setTokens(response.tokens.access, response.tokens.refresh);
      
      // Set user
      setUser(response.user);

      // Navigate based on role
      if (response.user.role === 'patient') {
        router.replace('/(patient)/home');
      } else if (response.user.role === 'therapist') {
        router.replace('/(therapist)/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    router.replace('/');
  };

  const value: AuthContextType = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;