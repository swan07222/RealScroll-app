// utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '@/constants/config';
import { User } from '@/types';

export const storage = {
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  async getObject<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage getObject error:', error);
      return null;
    }
  },

  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage setObject error:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

export async function storeToken(token: string, refreshToken: string): Promise<void> {
  await storage.set(Config.STORAGE_KEYS.AUTH_TOKEN, token);
  await storage.set(Config.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
}

export async function getStoredToken(): Promise<string | null> {
  return storage.get(Config.STORAGE_KEYS.AUTH_TOKEN);
}

export async function getStoredRefreshToken(): Promise<string | null> {
  return storage.get(Config.STORAGE_KEYS.REFRESH_TOKEN);
}

export async function storeUser(user: User): Promise<void> {
  await storage.setObject(Config.STORAGE_KEYS.USER, user);
}

export async function getStoredUser(): Promise<User | null> {
  return storage.getObject<User>(Config.STORAGE_KEYS.USER);
}

export async function clearAuth(): Promise<void> {
  await storage.remove(Config.STORAGE_KEYS.AUTH_TOKEN);
  await storage.remove(Config.STORAGE_KEYS.REFRESH_TOKEN);
  await storage.remove(Config.STORAGE_KEYS.USER);
}

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await storage.get(Config.STORAGE_KEYS.ONBOARDING_COMPLETE);
  return value === 'true';
}

export async function setOnboardingComplete(): Promise<void> {
  await storage.set(Config.STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
}