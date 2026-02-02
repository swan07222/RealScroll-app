// hooks/use-posts.ts
import { useState, useCallback } from 'react';
import { Post, CreatePostInput } from '@/types';
import { postsApi } from '@/api';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNum: number = 1, refresh: boolean = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const response = await postsApi.getFeed(pageNum);
      if (response.success) {
        if (refresh || pageNum === 1) {
          setPosts(response.data);
        } else {
          setPosts(prev => [...prev, ...response.data]);
        }
        setPage(pageNum);
        setHasMore(response.pagination.hasNext);
      } else {
        setError('Failed to load posts');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPosts(page + 1);
    }
  }, [isLoading, hasMore, page, fetchPosts]);

  const refresh = useCallback(() => {
    fetchPosts(1, true);
  }, [fetchPosts]);

  const likePost = useCallback(async (postId: string) => {
    try {
      const response = await postsApi.likePost(postId);
      if (response.success) {
        setPosts(prev =>
          prev.map(post =>
            post.id === postId ? response.data : post
          )
        );
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  }, []);

  const savePost = useCallback(async (postId: string) => {
    try {
      const response = await postsApi.savePost(postId);
      if (response.success) {
        setPosts(prev =>
          prev.map(post =>
            post.id === postId ? response.data : post
          )
        );
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  }, []);

  const createPost = useCallback(async (input: CreatePostInput) => {
    setIsLoading(true);
    try {
      const response = await postsApi.createPost(input);
      if (response.success) {
        setPosts(prev => [response.data, ...prev]);
        return response.data;
      }
      throw new Error('Failed to create post');
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    try {
      const response = await postsApi.deletePost(postId);
      if (response.success) {
        setPosts(prev => prev.filter(post => post.id !== postId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  }, []);

  return {
    posts,
    isLoading,
    isRefreshing,
    error,
    hasMore,
    fetchPosts,
    loadMore,
    refresh,
    likePost,
    savePost,
    createPost,
    deletePost,
  };
}

export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await postsApi.getPostById(postId);
      if (response.success) {
        setPost(response.data);
      } else {
        setError('Post not found');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const likePost = useCallback(async () => {
    if (!post) return;
    
    try {
      const response = await postsApi.likePost(post.id);
      if (response.success) {
        setPost(response.data);
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  }, [post]);

  const savePost = useCallback(async () => {
    if (!post) return;
    
    try {
      const response = await postsApi.savePost(post.id);
      if (response.success) {
        setPost(response.data);
      }
    } catch (err) {
      console.error('Save error:', err);
    }
  }, [post]);

  return {
    post,
    isLoading,
    error,
    fetchPost,
    likePost,
    savePost,
  };
}