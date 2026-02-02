// services/user.service.ts
import { Config } from '@/constants/config';
import { usersApi } from '@/api';
import * as mockData from '@/mocks';
import { 
  UserProfile, 
  UserListItem, 
  UpdateProfileRequest,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
} from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class UserService {
  private useMocks = Config.USE_MOCKS;
  private mockDelay = Config.MOCK_DELAY;

  async getProfile(userId: string): Promise<ApiResponse<UserProfile>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const user = mockData.getUserById(userId);
      if (!user) {
        throw {
          success: false,
          error: { code: 'NOT_FOUND', message: 'User not found' },
        };
      }
      return { success: true, data: user };
    }
    return usersApi.getProfile(userId);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const updatedUser: UserProfile = {
        ...mockData.currentUser,
        ...data,
        isFollowing: false,
        isFollowedBy: false,
      };
      return { success: true, data: updatedUser };
    }
    return usersApi.updateProfile(data);
  }

  async followUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      console.log('[Mock] Following user:', userId);
      return { success: true, data: { success: true } };
    }
    return usersApi.followUser(userId);
  }

  async unfollowUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      console.log('[Mock] Unfollowing user:', userId);
      return { success: true, data: { success: true } };
    }
    return usersApi.unfollowUser(userId);
  }

  async getFollowers(userId: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<UserListItem>>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return {
        success: true,
        data: {
          items: mockData.suggestedUsers,
          hasMore: false,
          total: mockData.suggestedUsers.length,
        },
      };
    }
    return usersApi.getFollowers(userId, params);
  }

  async getFollowing(userId: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<UserListItem>>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return {
        success: true,
        data: {
          items: mockData.suggestedUsers.filter((u) => u.isFollowing),
          hasMore: false,
          total: mockData.suggestedUsers.filter((u) => u.isFollowing).length,
        },
      };
    }
    return usersApi.getFollowing(userId, params);
  }

  async searchUsers(query: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<UserListItem>>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const results = mockData.searchUsers(query);
      return {
        success: true,
        data: {
          items: results,
          hasMore: false,
          total: results.length,
        },
      };
    }
    return usersApi.searchUsers(query, params);
  }

  async getSuggestedUsers(): Promise<ApiResponse<UserListItem[]>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return { success: true, data: mockData.suggestedUsers };
    }
    return usersApi.getSuggestedUsers();
  }
}

export const userService = new UserService();