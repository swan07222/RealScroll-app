// mocks/handlers/posts.ts
import { ApiResponse, PaginatedResponse, Post, CreatePostInput } from '@/types';
import { mockPosts, generateMockPosts, getMockPostById, getMockPostsByUserId } from '../data/posts';
import { mockUsers } from '../data/users';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let allPosts = [...mockPosts];

export const mockPostHandlers = {
  async getFeed(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> {
    await delay(600);
    
    const start = (page - 1) * limit;
    const end = start + limit;
    
    if (end > allPosts.length) {
      const newPosts = generateMockPosts(20, allPosts.length);
      allPosts = [...allPosts, ...newPosts];
    }
    
    const posts = allPosts.slice(start, end);
    
    return {
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total: allPosts.length + 100,
        totalPages: Math.ceil((allPosts.length + 100) / limit),
        hasNext: end < allPosts.length + 100,
        hasPrev: page > 1,
      },
    };
  },

  async getPostById(id: string): Promise<ApiResponse<Post>> {
    await delay(400);
    
    const post = getMockPostById(id) || allPosts.find(p => p.id === id);
    
    if (!post) {
      return {
        success: false,
        data: null as any,
        error: 'Post not found',
      };
    }
    
    return {
      success: true,
      data: post,
    };
  },

  async getPostsByUserId(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> {
    await delay(500);
    
    const userPosts = getMockPostsByUserId(userId);
    const start = (page - 1) * limit;
    const posts = userPosts.slice(start, start + limit);
    
    return {
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total: userPosts.length,
        totalPages: Math.ceil(userPosts.length / limit),
        hasNext: start + limit < userPosts.length,
        hasPrev: page > 1,
      },
    };
  },

  async createPost(input: CreatePostInput): Promise<ApiResponse<Post>> {
    await delay(1500);
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      userId: 'user-1',
      user: {
        id: 'user-1',
        username: 'johndoe',
        displayName: 'John Doe',
        avatar: 'https://i.pravatar.cc/150?u=user-1',
        isVerified: true,
      },
      content: input.content,
      mediaType: input.mediaType,
      mediaUrl: input.mediaUri || 'https://picsum.photos/800/600?random=new',
      thumbnailUrl: 'https://picsum.photos/400/300?random=new',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      isVerified: true,
      verificationBadge: 'human',
      location: input.location,
      tags: input.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    allPosts.unshift(newPost);
    
    return {
      success: true,
      data: newPost,
      message: 'Post created successfully',
    };
  },

  async likePost(postId: string): Promise<ApiResponse<Post>> {
    await delay(200);
    
    const postIndex = allPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Post not found',
      };
    }
    
    allPosts[postIndex] = {
      ...allPosts[postIndex],
      isLiked: !allPosts[postIndex].isLiked,
      likesCount: allPosts[postIndex].isLiked 
        ? allPosts[postIndex].likesCount - 1 
        : allPosts[postIndex].likesCount + 1,
    };
    
    return {
      success: true,
      data: allPosts[postIndex],
    };
  },

  async savePost(postId: string): Promise<ApiResponse<Post>> {
    await delay(200);
    
    const postIndex = allPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Post not found',
      };
    }
    
    allPosts[postIndex] = {
      ...allPosts[postIndex],
      isSaved: !allPosts[postIndex].isSaved,
    };
    
    return {
      success: true,
      data: allPosts[postIndex],
    };
  },

  async deletePost(postId: string): Promise<ApiResponse<null>> {
    await delay(400);
    
    const postIndex = allPosts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
      return {
        success: false,
        data: null,
        error: 'Post not found',
      };
    }
    
    allPosts.splice(postIndex, 1);
    
    return {
      success: true,
      data: null,
      message: 'Post deleted successfully',
    };
  },

  async searchPosts(query: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Post>> {
    await delay(500);
    
    const filtered = allPosts.filter(p => 
      p.content.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
    
    const start = (page - 1) * limit;
    const posts = filtered.slice(start, start + limit);
    
    return {
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasNext: start + limit < filtered.length,
        hasPrev: page > 1,
      },
    };
  },
};