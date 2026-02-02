// mocks/handlers/users.ts
import { ApiResponse, PaginatedResponse, User, UserProfile } from '@/types';
import { mockUsers, getMockUserById, getMockUserByUsername } from '../data/users';
import { getMockPostsByUserId } from '../data/posts';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const followRelations: Record<string, Set<string>> = {
  'user-1': new Set(['user-2', 'user-4']),
};

export const mockUserHandlers = {
  async getUserById(id: string): Promise<ApiResponse<User>> {
    await delay(400);
    
    const user = getMockUserById(id);
    
    if (!user) {
      return {
        success: false,
        data: null as any,
        error: 'User not found',
      };
    }
    
    return {
      success: true,
      data: user,
    };
  },

  async getUserProfile(id: string): Promise<ApiResponse<UserProfile>> {
    await delay(500);
    
    const user = getMockUserById(id);
    
    if (!user) {
      return {
        success: false,
        data: null as any,
        error: 'User not found',
      };
    }
    
    const posts = getMockPostsByUserId(id);
    const currentUserFollowing = followRelations['user-1'] || new Set();
    
    const profile: UserProfile = {
      ...user,
      isFollowing: currentUserFollowing.has(id),
      isFollowedBy: false,
      posts,
    };
    
    return {
      success: true,
      data: profile,
    };
  },

  async getUserByUsername(username: string): Promise<ApiResponse<User>> {
    await delay(400);
    
    const user = getMockUserByUsername(username);
    
    if (!user) {
      return {
        success: false,
        data: null as any,
        error: 'User not found',
      };
    }
    
    return {
      success: true,
      data: user,
    };
  },

  async followUser(userId: string): Promise<ApiResponse<{ following: boolean }>> {
    await delay(300);
    
    if (!followRelations['user-1']) {
      followRelations['user-1'] = new Set();
    }
    
    const isFollowing = followRelations['user-1'].has(userId);
    
    if (isFollowing) {
      followRelations['user-1'].delete(userId);
    } else {
      followRelations['user-1'].add(userId);
    }
    
    return {
      success: true,
      data: { following: !isFollowing },
    };
  },

  async getFollowers(userId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    await delay(500);
    
    const followers = mockUsers.filter(u => u.id !== userId).slice(0, 5);
    
    return {
      success: true,
      data: followers,
      pagination: {
        page,
        limit,
        total: followers.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  },

  async getFollowing(userId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    await delay(500);
    
    const followingIds = followRelations[userId] || new Set();
    const following = mockUsers.filter(u => followingIds.has(u.id));
    
    return {
      success: true,
      data: following,
      pagination: {
        page,
        limit,
        total: following.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    await delay(600);
    
    const updatedUser = {
      ...mockUsers[0],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return {
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully',
    };
  },

  async searchUsers(query: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    await delay(400);
    
    const filtered = mockUsers.filter(u =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.displayName.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      success: true,
      data: filtered,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  },
};