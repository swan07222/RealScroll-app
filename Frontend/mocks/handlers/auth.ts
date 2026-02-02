// mocks/handlers/auth.ts
import { ApiResponse, AuthUser, User } from '@/types';
import { mockCurrentUser, getMockUserByUsername } from '../data/users';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthHandlers = {
  async login(email: string, password: string): Promise<ApiResponse<AuthUser>> {
    await delay(800);
    
    if (!email || !password) {
      return {
        success: false,
        data: null as any,
        error: 'Email and password are required',
      };
    }
    
    return {
      success: true,
      data: mockCurrentUser,
      message: 'Login successful',
    };
  },

  async register(data: {
    email: string;
    password: string;
    username: string;
    displayName: string;
  }): Promise<ApiResponse<AuthUser>> {
    await delay(1000);
    
    if (getMockUserByUsername(data.username)) {
      return {
        success: false,
        data: null as any,
        error: 'Username already taken',
      };
    }
    
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      ...data,
      phone: undefined,
      avatar: `https://i.pravatar.cc/150?u=${data.username}`,
      bio: '',
      isVerified: false,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      token: `mock-token-${Date.now()}`,
      refreshToken: `mock-refresh-${Date.now()}`,
    };
    
    return {
      success: true,
      data: newUser,
      message: 'Registration successful',
    };
  },

  async sendOtp(phone: string): Promise<ApiResponse<{ sent: boolean }>> {
    await delay(500);
    
    return {
      success: true,
      data: { sent: true },
      message: 'OTP sent successfully',
    };
  },

  async verifyOtp(phone: string, otp: string): Promise<ApiResponse<AuthUser>> {
    await delay(800);
    
    if (otp.length !== 6) {
      return {
        success: false,
        data: null as any,
        error: 'Invalid OTP',
      };
    }
    
    return {
      success: true,
      data: mockCurrentUser,
      message: 'Phone verified successfully',
    };
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay(300);
    
    return {
      success: true,
      data: null,
      message: 'Logged out successfully',
    };
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    await delay(300);
    
    return {
      success: true,
      data: {
        token: `mock-token-refreshed-${Date.now()}`,
        refreshToken: `mock-refresh-${Date.now()}`,
      },
    };
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ sent: boolean }>> {
    await delay(600);
    
    return {
      success: true,
      data: { sent: true },
      message: 'Password reset email sent',
    };
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(400);
    
    return {
      success: true,
      data: mockCurrentUser,
    };
  },
};