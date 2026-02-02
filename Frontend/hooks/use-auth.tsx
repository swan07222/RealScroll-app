// hooks/use-auth.tsx
import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { router } from 'expo-router';
import { AuthUser, User } from '@/types';
import { authApi } from '@/api';
import { storage } from '@/utils/storage';
import { Config } from '@/constants/config';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; username: string; displayName: string }) => Promise<void>;
  logout: () => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await storage.get(Config.STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        const response = await authApi.getCurrentUser();
        if (response.success) {
          setUser(response.data);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    if (response.success) {
      const authUser = response.data as AuthUser;
      await storage.set(Config.STORAGE_KEYS.AUTH_TOKEN, authUser.token);
      await storage.set(Config.STORAGE_KEYS.REFRESH_TOKEN, authUser.refreshToken);
      await storage.setObject(Config.STORAGE_KEYS.USER, authUser);
      setUser(authUser);
      router.replace('/(tabs)');
    } else {
      throw new Error(response.error || 'Login failed');
    }
  }, []);

  const register = useCallback(async (data: { 
    email: string; 
    password: string; 
    username: string; 
    displayName: string;
  }) => {
    const response = await authApi.register(data);
    if (response.success) {
      const authUser = response.data as AuthUser;
      await storage.set(Config.STORAGE_KEYS.AUTH_TOKEN, authUser.token);
      await storage.set(Config.STORAGE_KEYS.REFRESH_TOKEN, authUser.refreshToken);
      await storage.setObject(Config.STORAGE_KEYS.USER, authUser);
      setUser(authUser);
      router.replace('/(tabs)');
    } else {
      throw new Error(response.error || 'Registration failed');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await storage.remove(Config.STORAGE_KEYS.AUTH_TOKEN);
      await storage.remove(Config.STORAGE_KEYS.REFRESH_TOKEN);
      await storage.remove(Config.STORAGE_KEYS.USER);
      setUser(null);
      router.replace('/(onboarding)');
    }
  }, []);

  const sendOtp = useCallback(async (phone: string) => {
    const response = await authApi.sendOtp(phone);
    if (!response.success) {
      throw new Error(response.error || 'Failed to send OTP');
    }
  }, []);

  const verifyOtp = useCallback(async (phone: string, otp: string) => {
    const response = await authApi.verifyOtp(phone, otp);
    if (response.success) {
      const authUser = response.data as AuthUser;
      await storage.set(Config.STORAGE_KEYS.AUTH_TOKEN, authUser.token);
      await storage.set(Config.STORAGE_KEYS.REFRESH_TOKEN, authUser.refreshToken);
      await storage.setObject(Config.STORAGE_KEYS.USER, authUser);
      setUser(authUser);
    } else {
      throw new Error(response.error || 'Invalid OTP');
    }
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    storage.setObject(Config.STORAGE_KEYS.USER, updatedUser);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    sendOtp,
    verifyOtp,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}