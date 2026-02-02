// api/endpoints/auth.ts
import { Config } from '@/constants/config';
import { ApiResponse, AuthUser, User } from '@/types';
import { apiClient } from '../client';
import { mockAuthHandlers } from '@/mocks';

export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse<AuthUser>> {
    if (Config.USE_MOCKS) {
      return mockAuthHandlers.login(email, password);
    }
    return apiClient.post('/auth/login', { email, password });
  },

  async register(data: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }): Promise<ApiResponse<AuthUser>> {
    if (Config.USE_MOCKS) {
      return mockAuthHandlers.register(data);
    }
    return apiClient.post('/auth/register', data);
  },

  async sendOtp(phone: string): Promise<ApiResponse<{ sent: boolean }>> {
    if (Config.USE_MOCKS) {
      return mockAuthHandlers.sendOtp(phone);
    }
    return apiClient.post('/auth/send-otp', { phone });
  },

  async verifyOtp(phone: string, otp: string): Promise<ApiResponse<AuthUser>> {
    if (Config.USE_MOCKS) {
      return mockAuthHandlers.verifyOtp(phone, otp);
    }
    return apiClient.post('/auth/verify-otp', { phone, otp });
  },

  async logout(): Promise<ApiResponse<null>> {
    if (Config.USE_MOCKS) {
      return mockAuthHandlers.logout();
    }
    return apiClient.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    if (Config.USE_MOCKS) {
      return mockAuthHandlers.refreshToken(refreshToken);
    }
    return apiClient.post('/auth/refresh', { refreshToken });
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ sent: boolean }>> {
    if (Config.USE_MOCKS) {
      return mockAuthHandlers.forgotPassword(email);
    }
    return apiClient.post('/auth/forgot-password', { email });
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (Config.USE_MOCKS) {
      return mockAuthHandlers.getCurrentUser();
    }
    return apiClient.get('/auth/me');
  },
};