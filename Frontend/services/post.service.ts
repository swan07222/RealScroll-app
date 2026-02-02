// services/post.service.ts
import { Config } from '@/constants/config';
import { postsApi } from '@/api';
import * as mockData from '@/mocks';
import { 
  Post, 
  Comment, 
  CreatePostRequest, 
  FeedResponse,
  PaginatedResponse,
  PaginationParams,
  ApiResponse,
} from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class PostService {
  private useMocks = Config.USE_MOCKS;
  private mockDelay = Config.MOCK_DELAY;

  async getFeed(params?: PaginationParams): Promise<ApiResponse<FeedResponse>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const feed = mockData.getFeed(params?.cursor, params?.limit);
      return { success: true, data: feed };
    }
    return postsApi.getFeed(params);
  }

  async getExplore(params?: PaginationParams): Promise<ApiResponse<FeedResponse>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const explorePosts = mockData.getExplorePosts();
      return {
        success: true,
        data: {
          posts: explorePosts.slice(0, params?.limit || 20),
          hasMore: false,
        },
      };
    }
    return postsApi.getExplore(params);
  }

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const post = mockData.getPostById(postId);
      if (!post) {
        throw {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Post not found' },
        };
      }
      return { success: true, data: post };
    }
    return postsApi.getPost(postId);
  }

  async getUserPosts(userId: string, params?: PaginationParams): Promise<ApiResponse<FeedResponse>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const userPosts = mockData.getUserPosts(userId);
      return {
        success: true,
        data: {
          posts: userPosts,
          hasMore: false,
        },
      };
    }
    return postsApi.getUserPosts(userId, params);
  }

  async createPost(data: CreatePostRequest): Promise<ApiResponse<Post>> {
    if (this.useMocks) {
      await delay(this.mockDelay * 2); // Simulate longer upload time
      const newPost: Post = {
        id: 'post-' + Date.now(),
        author: {
          id: mockData.currentUser.id,
          username: mockData.currentUser.username,
          displayName: mockData.currentUser.displayName,
          avatar: mockData.currentUser.avatar,
          isVerified: mockData.currentUser.isVerified,
        },
        caption: data.caption,
        media: data.media.map((m, i) => ({
          id: `media-${Date.now()}-${i}`,
          url: m.uri,
          type: m.type,
          width: m.width,
          height: m.height,
        })),
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        isLiked: false,
        isSaved: false,
        isVerifiedReal: true,
        location: data.location,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, data: newPost };
    }
    return postsApi.createPost(data);
  }

  async likePost(postId: string): Promise<ApiResponse<{ success: boolean; likesCount: number }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const post = mockData.getPostById(postId);
      return {
        success: true,
        data: { success: true, likesCount: (post?.likesCount || 0) + 1 },
      };
    }
    return postsApi.likePost(postId);
  }

  async unlikePost(postId: string): Promise<ApiResponse<{ success: boolean; likesCount: number }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const post = mockData.getPostById(postId);
      return {
        success: true,
        data: { success: true, likesCount: Math.max((post?.likesCount || 1) - 1, 0) },
      };
    }
    return postsApi.unlikePost(postId);
  }

  async savePost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return { success: true, data: { success: true } };
    }
    return postsApi.savePost(postId);
  }

  async unsavePost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return { success: true, data: { success: true } };
    }
    return postsApi.unsavePost(postId);
  }

  async getComments(postId: string, params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Comment>>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const comments = mockData.generateComments(postId);
      return {
        success: true,
        data: {
          items: comments,
          hasMore: false,
          total: comments.length,
        },
      };
    }
    return postsApi.getComments(postId, params);
  }

  async addComment(postId: string, content: string): Promise<ApiResponse<Comment>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const newComment: Comment = {
        id: 'comment-' + Date.now(),
        postId,
        author: {
          id: mockData.currentUser.id,
          username: mockData.currentUser.username,
          displayName: mockData.currentUser.displayName,
          avatar: mockData.currentUser.avatar,
          isVerified: mockData.currentUser.isVerified,
        },
        content,
        likesCount: 0,
        isLiked: false,
        repliesCount: 0,
        createdAt: new Date().toISOString(),
      };
      return { success: true, data: newComment };
    }
    return postsApi.addComment(postId, content);
  }

  async deletePost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return { success: true, data: { success: true } };
    }
    return postsApi.deletePost(postId);
  }
}

export const postService = new PostService();