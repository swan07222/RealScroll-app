// api/endpoints/users.ts
import { Config } from '@/constants/config';
import { ApiResponse, PaginatedResponse, User, UserProfile } from '@/types';
import { apiClient } from '../client';
import { mockUserHandlers } from '@/mocks';

export const usersApi = {
  async getUserById(id: string): Promise<ApiResponse<User>> {
    if (Config.USE_MOCKS) {
      return mockUserHandlers.getUserById(id);
    }
    return apiClient.get(`/users/${id}`);
  },

  async getUserProfile(id: string): Promise<ApiResponse<UserProfile>> {
    if (Config.USE_MOCKS) {
      return mockUserHandlers.getUserProfile(id);
    }
    return apiClient.get(`/users/${id}/profile`);
  },

  async getUserByUsername(username: string): Promise<ApiResponse<User>> {
    if (Config.USE_MOCKS) {
      return mockUserHandlers.getUserByUsername(username);
    }
    return apiClient.get(`/users/username/${username}`);
  },

  async followUser(userId: string): Promise<ApiResponse<{ following: boolean }>> {
    if (Config.USE_MOCKS) {
      return mockUserHandlers.followUser(userId);
    }
    return apiClient.post(`/users/${userId}/follow`);
  },

  async getFollowers(userId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    if (Config.USE_MOCKS) {
      return mockUserHandlers.getFollowers(userId, page, limit);
    }
    return apiClient.get(`/users/${userId}/followers?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<User>>;
  },

  async getFollowing(userId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    if (Config.USE_MOCKS) {
      return mockUserHandlers.getFollowing(userId, page, limit);
    }
    return apiClient.get(`/users/${userId}/following?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<User>>;
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    if (Config.USE_MOCKS) {
      return mockUserHandlers.updateProfile(data);
    }
    return apiClient.patch('/users/me', data);
  },

  async searchUsers(query: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<User>> {
    if (Config.USE_MOCKS) {
      return mockUserHandlers.searchUsers(query, page, limit);
    }
    return apiClient.get(`/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`) as Promise<PaginatedResponse<User>>;
  },
};