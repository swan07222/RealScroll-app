// services/auth.service.ts
import { Config } from '@/constants/config';
import { authApi } from '@/api';
import { mockCurrentUser } from '@/mocks';
import { 
  RegisterRequest, 
  AuthResponse, 
  User,
  ApiResponse,
} from '@/types';
import { storeToken, storeUser, clearAuth, getStoredUser } from '@/utils/storage';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class AuthService {
  private useMocks = Config.USE_MOCKS;
  private mockDelay = Config.MOCK_DELAY;

  async sendVerificationCode(phone: string): Promise<ApiResponse<{ sent: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      console.log('[Mock] Sending verification code to:', phone);
      return {
        success: true,
        data: { sent: true },
      };
    }
    return authApi.sendOtp(phone);
  }

  async verifyCode(phone: string, code: string): Promise<ApiResponse<AuthResponse>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      
      if (code.length !== 6) {
        return {
          success: false,
          data: null as any,
          error: 'Invalid verification code',
        };
      }

      const response: AuthResponse = {
        user: mockCurrentUser,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        isNewUser: false,
      };

      await storeToken(response.token, response.refreshToken);
      await storeUser(response.user);

      return { success: true, data: response };
    }

    const apiResponse = await authApi.verifyOtp(phone, code);
    if (apiResponse.success) {
      const authUser = apiResponse.data;
      await storeToken(authUser.token, authUser.refreshToken);
      await storeUser(authUser);
      return {
        success: true,
        data: {
          user: authUser,
          token: authUser.token,
          refreshToken: authUser.refreshToken,
          isNewUser: false,
        },
      };
    }
    return {
      success: false,
      data: null as any,
      error: apiResponse.error,
    };
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

    const apiResponse = await authApi.register({
      email: data.email || '',
      password: '',
      username: data.username,
      displayName: data.displayName,
    });
    
    if (apiResponse.success) {
      const authUser = apiResponse.data;
      await storeToken(authUser.token, authUser.refreshToken);
      await storeUser(authUser);
      return {
        success: true,
        data: {
          user: authUser,
          token: authUser.token,
          refreshToken: authUser.refreshToken,
          isNewUser: true,
        },
      };
    }
    
    return {
      success: false,
      data: null as any,
      error: apiResponse.error,
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const storedUser = await getStoredUser();
      return {
        success: true,
        data: storedUser || mockCurrentUser,
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