// mocks/handlers/comments.ts
import { ApiResponse, PaginatedResponse, Comment, CreateCommentInput } from '@/types';
import { getMockCommentsByPostId, generateMockComments, mockComments } from '../data/comments';
import { mockUsers } from '../data/users';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockCommentHandlers = {
  async getCommentsByPostId(postId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Comment>> {
    await delay(500);
    
    let comments = getMockCommentsByPostId(postId);
    
    if (comments.length === 0) {
      comments = generateMockComments(postId, 10);
      mockComments[postId] = comments;
    }
    
    const start = (page - 1) * limit;
    const paginatedComments = comments.slice(start, start + limit);
    
    return {
      success: true,
      data: paginatedComments,
      pagination: {
        page,
        limit,
        total: comments.length,
        totalPages: Math.ceil(comments.length / limit),
        hasNext: start + limit < comments.length,
        hasPrev: page > 1,
      },
    };
  },

  async createComment(input: CreateCommentInput): Promise<ApiResponse<Comment>> {
    await delay(400);
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId: input.postId,
      userId: 'user-1',
      user: {
        id: 'user-1',
        username: mockUsers[0].username,
        displayName: mockUsers[0].displayName,
        avatar: mockUsers[0].avatar,
        isVerified: mockUsers[0].isVerified,
      },
      content: input.content,
      likesCount: 0,
      isLiked: false,
      repliesCount: 0,
      parentId: input.parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (!mockComments[input.postId]) {
      mockComments[input.postId] = [];
    }
    mockComments[input.postId].unshift(newComment);
    
    return {
      success: true,
      data: newComment,
      message: 'Comment added successfully',
    };
  },

  async likeComment(commentId: string): Promise<ApiResponse<Comment>> {
    await delay(200);
    
    for (const postId in mockComments) {
      const commentIndex = mockComments[postId].findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        mockComments[postId][commentIndex] = {
          ...mockComments[postId][commentIndex],
          isLiked: !mockComments[postId][commentIndex].isLiked,
          likesCount: mockComments[postId][commentIndex].isLiked
            ? mockComments[postId][commentIndex].likesCount - 1
            : mockComments[postId][commentIndex].likesCount + 1,
        };
        
        return {
          success: true,
          data: mockComments[postId][commentIndex],
        };
      }
    }
    
    return {
      success: false,
      data: null as any,
      error: 'Comment not found',
    };
  },

  async deleteComment(commentId: string): Promise<ApiResponse<null>> {
    await delay(300);
    
    for (const postId in mockComments) {
      const commentIndex = mockComments[postId].findIndex(c => c.id === commentId);
      if (commentIndex !== -1) {
        mockComments[postId].splice(commentIndex, 1);
        return {
          success: true,
          data: null,
          message: 'Comment deleted successfully',
        };
      }
    }
    
    return {
      success: false,
      data: null,
      error: 'Comment not found',
    };
  },
};