// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  // Get item
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  // Set item
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  },

  // Remove item
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
    }
  },

  // Clear all
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

// Token specific helpers
export const tokenStorage = {
  getAccessToken: () => storage.getItem('access_token'),
  getRefreshToken: () => storage.getItem('refresh_token'),
  
  setTokens: async (accessToken: string, refreshToken: string) => {
    await storage.setItem('access_token', accessToken);
    await storage.setItem('refresh_token', refreshToken);
  },
  
  clearTokens: async () => {
    await storage.removeItem('access_token');
    await storage.removeItem('refresh_token');
  },
};

export default storage;