// services/user.service.ts
import { Config } from '@/constants/config';
import { usersApi } from '@/api';
import { getUserById, searchUsers as mockSearchUsers, suggestedUsers, mockCurrentUser } from '@/mocks';
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
      const user = getUserById(userId);
      if (!user) {
        return {
          success: false,
          data: null as any,
          error: 'User not found',
        };
      }
      return {
        success: true,
        data: {
          ...user,
          isFollowing: false,
          isFollowedBy: false,
        },
      };
    }
    return usersApi.getUserProfile(userId);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const updatedUser: UserProfile = {
        ...mockCurrentUser,
        ...data,
        isFollowing: false,
        isFollowedBy: false,
      };
      return { success: true, data: updatedUser };
    }
    const response = await usersApi.updateProfile(data);
    return {
      success: response.success,
      data: {
        ...response.data,
        isFollowing: false,
        isFollowedBy: false,
      },
    };
  }

  async followUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      console.log('[Mock] Following user:', userId);
      return { success: true, data: { success: true } };
    }
    const response = await usersApi.followUser(userId);
    return { success: response.success, data: { success: response.data?.following || false } };
  }

  async unfollowUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      console.log('[Mock] Unfollowing user:', userId);
      return { success: true, data: { success: true } };
    }
    const response = await usersApi.followUser(userId);
    return { success: response.success, data: { success: !response.data?.following } };
  }

  async getFollowers(userId: string, params?: PaginationParams): Promise<PaginatedResponse<UserListItem>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const followers = suggestedUsers.map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatar: u.avatar,
        bio: u.bio,
        isVerified: u.isVerified,
        isFollowing: u.isFollowing,
      }));
      return {
        success: true,
        data: followers,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: followers.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
    const response = await usersApi.getFollowers(userId, params?.page, params?.limit);
    return {
      success: response.success,
      data: response.data.map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatar: u.avatar,
        bio: u.bio,
        isVerified: u.isVerified,
      })),
      pagination: response.pagination,
    };
  }

  async getFollowing(userId: string, params?: PaginationParams): Promise<PaginatedResponse<UserListItem>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const following = suggestedUsers.filter(u => u.isFollowing).map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatar: u.avatar,
        bio: u.bio,
        isVerified: u.isVerified,
        isFollowing: true,
      }));
      return {
        success: true,
        data: following,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: following.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
    const response = await usersApi.getFollowing(userId, params?.page, params?.limit);
    return {
      success: response.success,
      data: response.data.map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatar: u.avatar,
        bio: u.bio,
        isVerified: u.isVerified,
      })),
      pagination: response.pagination,
    };
  }

  async searchUsers(query: string, params?: PaginationParams): Promise<PaginatedResponse<UserListItem>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const results = mockSearchUsers(query).map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatar: u.avatar,
        bio: u.bio,
        isVerified: u.isVerified,
      }));
      return {
        success: true,
        data: results,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: results.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
    const response = await usersApi.searchUsers(query, params?.page, params?.limit);
    return {
      success: response.success,
      data: response.data.map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatar: u.avatar,
        bio: u.bio,
        isVerified: u.isVerified,
      })),
      pagination: response.pagination,
    };
  }

  async getSuggestedUsers(): Promise<ApiResponse<UserListItem[]>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return {
        success: true,
        data: suggestedUsers.map(u => ({
          id: u.id,
          username: u.username,
          displayName: u.displayName,
          avatar: u.avatar,
          bio: u.bio,
          isVerified: u.isVerified,
          isFollowing: u.isFollowing,
        })),
      };
    }
    const response = await usersApi.searchUsers('', 1, 10);
    return {
      success: response.success,
      data: response.data.map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        avatar: u.avatar,
        bio: u.bio,
        isVerified: u.isVerified,
      })),
    };
  }
}

export const userService = new UserService();