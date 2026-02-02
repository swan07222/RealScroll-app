// services/auth.service.ts
import { Config } from '@/constants/config';
import { authApi } from '@/api';
import * as mockData from '@/mocks';
import { 
  LoginRequest, 
  VerifyCodeRequest, 
  RegisterRequest, 
  AuthResponse, 
  User,
  ApiResponse,
} from '@/types';
import { storeToken, storeUser, clearAuth, getStoredUser } from '@/utils/storage';

// Simulate network delay for mocks
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class AuthService {
  private useMocks = Config.USE_MOCKS;
  private mockDelay = Config.MOCK_DELAY;

  async sendVerificationCode(data: LoginRequest): Promise<ApiResponse<{ success: boolean; message: string }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      console.log('[Mock] Sending verification code to:', data.phone);
      return {
        success: true,
        data: { success: true, message: 'Verification code sent' },
      };
    }
    return authApi.sendVerificationCode(data);
  }

  async verifyCode(data: VerifyCodeRequest): Promise<ApiResponse<AuthResponse>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      
      // Mock: Accept any 6-digit code
      if (data.code.length !== 6) {
        throw {
          success: false,
          error: {
            code: 'INVALID_CODE',
            message: 'Invalid verification code',
          },
        };
      }

      const response: AuthResponse = {
        user: mockData.currentUser,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        isNewUser: false,
      };

      // Store auth data
      await storeToken(response.token, response.refreshToken);
      await storeUser(response.user);

      return { success: true, data: response };
    }

    const response = await authApi.verifyCode(data);
    if (response.success) {
      await storeToken(response.data.token, response.data.refreshToken);
      await storeUser(response.data.user);
    }
    return response;
  }

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    if (this.useMocks) {
      await delay(this.mockDelay);

      const newUser: User = {
        id: 'user-' + Date.now(),
        username: data.username,
        displayName: data.displayName,
        phone: data.phone,
        email: data.email,
        isVerified: false,
        followersCount: 0,
        followingCount: 0,
        postsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response: AuthResponse = {
        user: newUser,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        isNewUser: true,
      };

      await storeToken(response.token, response.refreshToken);
      await storeUser(response.user);

      return { success: true, data: response };
    }

    const response = await authApi.register(data);
    if (response.success) {
      await storeToken(response.data.token, response.data.refreshToken);
      await storeUser(response.data.user);
    }
    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const storedUser = await getStoredUser();
      return {
        success: true,
        data: storedUser || mockData.currentUser,
      };
    }
    return authApi.getCurrentUser();
  }

  async logout(): Promise<void> {
    if (!this.useMocks) {
      try {
        await authApi.logout();
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    await clearAuth();
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const newTokens = {
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      };
      await storeToken(newTokens.token, newTokens.refreshToken);
      return { success: true, data: newTokens };
    }
    return authApi.refreshToken(refreshToken);
  }
}

export const authService = new AuthService();