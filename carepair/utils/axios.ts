// utils/axios.ts
import axios from 'axios';
import { EXPO_PUBLIC_API_URL } from '@env';
import { tokenStorage } from './storage';

// Ensure BASE_URL comes from your .env (Ngrok URL)
const BASE_URL = EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ===== REQUEST INTERCEPTOR =====
// Attach Bearer token automatically
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Auth token storage not ready.');
    }
    console.log(`➡️ Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== RESPONSE INTERCEPTOR =====
// Handle errors and refresh tokens if expired
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Network / Timeout issues
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error(`❌ NETWORK ERROR: Ensure Ngrok tunnel is running at ${BASE_URL}`);
    }

    // Token expired (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access, refresh } = response.data;
          await tokenStorage.setTokens(access, refresh || refreshToken);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ SESSION EXPIRED: Please log in again.');
        await tokenStorage.clearTokens();
      }
    }

    console.error(
      `❌ Response Error: ${error.response?.status} ${originalRequest?.url}`,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
