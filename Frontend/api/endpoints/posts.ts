// api/endpoints/posts.ts
import { Config } from '@/constants/config';
import { ApiResponse, PaginatedResponse, Post, CreatePostInput } from '@/types';
import { apiClient } from '../client';
import { mockPostHandlers } from '@/mocks';

export const postsApi = {
  async getFeed(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> {
    if (Config.USE_MOCKS) {
      return mockPostHandlers.getFeed(page, limit);
    }
    return apiClient.get(`/posts/feed?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Post>>;
  },

  async getPostById(id: string): Promise<ApiResponse<Post>> {
    if (Config.USE_MOCKS) {
      return mockPostHandlers.getPostById(id);
    }
    return apiClient.get(`/posts/${id}`);
  },

  async getPostsByUserId(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> {
    if (Config.USE_MOCKS) {
      return mockPostHandlers.getPostsByUserId(userId, page, limit);
    }
    return apiClient.get(`/users/${userId}/posts?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Post>>;
  },

  async createPost(input: CreatePostInput): Promise<ApiResponse<Post>> {
    if (Config.USE_MOCKS) {
      return mockPostHandlers.createPost(input);
    }
    
    // For real API, use FormData for file upload
    const formData = new FormData();
    formData.append('content', input.content);
    formData.append('mediaType', input.mediaType);
    
    if (input.mediaUri) {
      formData.append('media', {
        uri: input.mediaUri,
        type: input.mediaType === 'image' ? 'image/jpeg' : 'video/mp4',
        name: `upload.${input.mediaType === 'image' ? 'jpg' : 'mp4'}`,
      } as any);
    }
    
    if (input.location) formData.append('location', input.location);
    if (input.tags) formData.append('tags', JSON.stringify(input.tags));
    
    return apiClient.upload('/posts', formData);
  },

  async likePost(postId: string): Promise<ApiResponse<Post>> {
    if (Config.USE_MOCKS) {
      return mockPostHandlers.likePost(postId);
    }
    return apiClient.post(`/posts/${postId}/like`);
  },

  async savePost(postId: string): Promise<ApiResponse<Post>> {
    if (Config.USE_MOCKS) {
      return mockPostHandlers.savePost(postId);
    }
    return apiClient.post(`/posts/${postId}/save`);
  },

  async deletePost(postId: string): Promise<ApiResponse<null>> {
    if (Config.USE_MOCKS) {
      return mockPostHandlers.deletePost(postId);
    }
    return apiClient.delete(`/posts/${postId}`);
  },

  async searchPosts(query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> {
    if (Config.USE_MOCKS) {
      return mockPostHandlers.searchPosts(query, page, limit);
    }
    return apiClient.get(`/posts/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Post>>;
  },
};