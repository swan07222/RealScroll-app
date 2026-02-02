// services/post.service.ts
import { Config } from '@/constants/config';
import { postsApi, commentsApi } from '@/api';
import { 
  getFeed, 
  getExplorePosts, 
  getPostById, 
  getUserPosts, 
  generateCommentsList,
  mockCurrentUser 
} from '@/mocks';
import { 
  Post, 
  Comment, 
  CreatePostInput,
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
      const feed = getFeed(params?.cursor, params?.limit);
      return { success: true, data: feed };
    }
    const response = await postsApi.getFeed(params?.page, params?.limit);
    return {
      success: response.success,
      data: {
        posts: response.data,
        hasMore: response.pagination?.hasNext || false,
      },
    };
  }

  async getExplore(params?: PaginationParams): Promise<ApiResponse<FeedResponse>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const explorePosts = getExplorePosts();
      return {
        success: true,
        data: {
          posts: explorePosts.slice(0, params?.limit || 20),
          hasMore: false,
        },
      };
    }
    const response = await postsApi.getFeed(params?.page, params?.limit);
    return {
      success: response.success,
      data: {
        posts: response.data,
        hasMore: response.pagination?.hasNext || false,
      },
    };
  }

  async getPost(postId: string): Promise<ApiResponse<Post>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const post = getPostById(postId);
      if (!post) {
        return {
          success: false,
          data: null as any,
          error: 'Post not found',
        };
      }
      return { success: true, data: post };
    }
    return postsApi.getPostById(postId);
  }

  async getUserPosts(userId: string, params?: PaginationParams): Promise<ApiResponse<FeedResponse>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const userPosts = getUserPosts(userId);
      return {
        success: true,
        data: {
          posts: userPosts,
          hasMore: false,
        },
      };
    }
    const response = await postsApi.getPostsByUserId(userId, params?.page, params?.limit);
    return {
      success: response.success,
      data: {
        posts: response.data,
        hasMore: response.pagination?.hasNext || false,
      },
    };
  }

  async createPost(data: CreatePostInput): Promise<ApiResponse<Post>> {
    if (this.useMocks) {
      await delay(this.mockDelay * 2);
      const newPost: Post = {
        id: 'post-' + Date.now(),
        userId: mockCurrentUser.id,
        user: {
          id: mockCurrentUser.id,
          username: mockCurrentUser.username,
          displayName: mockCurrentUser.displayName,
          avatar: mockCurrentUser.avatar,
          isVerified: mockCurrentUser.isVerified,
        },
        content: data.content,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUri,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        isLiked: false,
        isSaved: false,
        isVerified: true,
        verificationBadge: 'human',
        location: data.location,
        tags: data.tags || [],
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
      const post = getPostById(postId);
      return {
        success: true,
        data: { success: true, likesCount: (post?.likesCount || 0) + 1 },
      };
    }
    const response = await postsApi.likePost(postId);
    return {
      success: response.success,
      data: { success: response.success, likesCount: response.data?.likesCount || 0 },
    };
  }

  async unlikePost(postId: string): Promise<ApiResponse<{ success: boolean; likesCount: number }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const post = getPostById(postId);
      return {
        success: true,
        data: { success: true, likesCount: Math.max((post?.likesCount || 1) - 1, 0) },
      };
    }
    const response = await postsApi.likePost(postId);
    return {
      success: response.success,
      data: { success: response.success, likesCount: response.data?.likesCount || 0 },
    };
  }

  async savePost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return { success: true, data: { success: true } };
    }
    const response = await postsApi.savePost(postId);
    return { success: response.success, data: { success: response.success } };
  }

  async unsavePost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return { success: true, data: { success: true } };
    }
    const response = await postsApi.savePost(postId);
    return { success: response.success, data: { success: response.success } };
  }

  async getComments(postId: string, params?: PaginationParams): Promise<PaginatedResponse<Comment>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const comments = generateCommentsList(postId, 10);
      return {
        success: true,
        data: comments,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: comments.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
    return commentsApi.getCommentsByPostId(postId, params?.page, params?.limit);
  }

  async addComment(postId: string, content: string): Promise<ApiResponse<Comment>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const newComment: Comment = {
        id: 'comment-' + Date.now(),
        postId,
        userId: mockCurrentUser.id,
        user: {
          id: mockCurrentUser.id,
          username: mockCurrentUser.username,
          displayName: mockCurrentUser.displayName,
          avatar: mockCurrentUser.avatar,
          isVerified: mockCurrentUser.isVerified,
        },
        content,
        likesCount: 0,
        isLiked: false,
        repliesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, data: newComment };
    }
    return commentsApi.createComment({ postId, content });
  }

  async deletePost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return { success: true, data: { success: true } };
    }
    const response = await postsApi.deletePost(postId);
    return { success: response.success, data: { success: response.success } };
  }
}

export const postService = new PostService();