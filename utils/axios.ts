// utils/axios.ts
import axios from 'axios';
import { Platform } from 'react-native';
import { tokenStorage } from './storage';

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// Your computer's local IP address (find it using `ipconfig` on Windows or `ifconfig` on Mac/Linux)
const LOCAL_IP = '192.168.1.17'; // <-- CHANGE THIS to your actual IP

// Your production backend URL (when you deploy)
const PRODUCTION_URL = 'https://your-api-domain.com/api'; // <-- CHANGE THIS when you deploy

// Set to true when testing on physical device, false for emulator
const USE_PHYSICAL_DEVICE = true;

// Set to true when using production server
const USE_PRODUCTION = false;

// ============================================
// AUTO-CONFIGURED API URL
// ============================================

const getApiUrl = (): string => {
  // Production mode
  if (USE_PRODUCTION) {
    return PRODUCTION_URL;
  }

  // Physical device - must use your computer's actual IP
  if (USE_PHYSICAL_DEVICE) {
    return `http://${LOCAL_IP}:8000/api`;
  }

  // Emulator/Simulator
  if (Platform.OS === 'android') {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:8000/api';
  } else {
    // iOS simulator can use localhost directly
    return 'http://localhost:8000/api';
  }
};

const API_URL = getApiUrl();

// Log the URL being used (helpful for debugging)
console.log('📡 API URL:', API_URL);

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access, refresh } = response.data;

        // Store new tokens
        await tokenStorage.setTokens(access, refresh || refreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens
        await tokenStorage.clearTokens();
        // Navigation to login will be handled by AuthContext
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;