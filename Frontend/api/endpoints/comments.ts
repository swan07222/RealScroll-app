// api/endpoints/comments.ts
import { Config } from '@/constants/config';
import { ApiResponse, PaginatedResponse, Comment, CreateCommentInput } from '@/types';
import { apiClient } from '../client';
import { mockCommentHandlers } from '@/mocks';

export const commentsApi = {
  async getCommentsByPostId(postId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Comment>> {
    if (Config.USE_MOCKS) {
      return mockCommentHandlers.getCommentsByPostId(postId, page, limit);
    }
    return apiClient.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Comment>>;
  },

  async createComment(input: CreateCommentInput): Promise<ApiResponse<Comment>> {
    if (Config.USE_MOCKS) {
      return mockCommentHandlers.createComment(input);
    }
    return apiClient.post(`/posts/${input.postId}/comments`, input);
  },

  async likeComment(commentId: string): Promise<ApiResponse<Comment>> {
    if (Config.USE_MOCKS) {
      return mockCommentHandlers.likeComment(commentId);
    }
    return apiClient.post(`/comments/${commentId}/like`);
  },

  async deleteComment(commentId: string): Promise<ApiResponse<null>> {
    if (Config.USE_MOCKS) {
      return mockCommentHandlers.deleteComment(commentId);
    }
    return apiClient.delete(`/comments/${commentId}`);
  },
};