// hooks/use-user.ts
import { useState, useCallback } from 'react';
import { User, UserProfile, Post } from '@/types';
import { usersApi, postsApi } from '@/api';

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await usersApi.getUserProfile(userId);
      if (response.success) {
        setProfile(response.data);
      } else {
        setError('User not found');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const toggleFollow = useCallback(async () => {
    if (!profile) return;

    try {
      const response = await usersApi.followUser(profile.id);
      if (response.success) {
        setProfile(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            isFollowing: response.data.following,
            followersCount: response.data.following
              ? prev.followersCount + 1
              : prev.followersCount - 1,
          };
        });
      }
    } catch (err) {
      console.error('Follow error:', err);
    }
  }, [profile]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    toggleFollow,
  };
}

export function useUserPosts(userId: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (pageNum: number = 1) => {
    setIsLoading(true);

    try {
      const response = await postsApi.getPostsByUserId(userId, pageNum);
      if (response.success) {
        if (pageNum === 1) {
          setPosts(response.data);
        } else {
          setPosts(prev => [...prev, ...response.data]);
        }
        setPage(pageNum);
        setHasMore(response.pagination.hasNext);
      }
    } catch (err) {
      console.error('Fetch posts error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPosts(page + 1);
    }
  }, [isLoading, hasMore, page, fetchPosts]);

  return {
    posts,
    isLoading,
    hasMore,
    fetchPosts,
    loadMore,
  };
}

export function useFollowers(userId: string) {
  const [followers, setFollowers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFollowers = useCallback(async (pageNum: number = 1) => {
    setIsLoading(true);

    try {
      const response = await usersApi.getFollowers(userId, pageNum);
      if (response.success) {
        if (pageNum === 1) {
          setFollowers(response.data);
        } else {
          setFollowers(prev => [...prev, ...response.data]);
        }
        setPage(pageNum);
        setHasMore(response.pagination.hasNext);
      }
    } catch (err) {
      console.error('Fetch followers error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchFollowers(page + 1);
    }
  }, [isLoading, hasMore, page, fetchFollowers]);

  return {
    followers,
    isLoading,
    hasMore,
    fetchFollowers,
    loadMore,
  };
}

export function useFollowing(userId: string) {
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFollowing = useCallback(async (pageNum: number = 1) => {
    setIsLoading(true);

    try {
      const response = await usersApi.getFollowing(userId, pageNum);
      if (response.success) {
        if (pageNum === 1) {
          setFollowing(response.data);
        } else {
          setFollowing(prev => [...prev, ...response.data]);
        }
        setPage(pageNum);
        setHasMore(response.pagination.hasNext);
      }
    } catch (err) {
      console.error('Fetch following error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchFollowing(page + 1);
    }
  }, [isLoading, hasMore, page, fetchFollowing]);

  return {
    following,
    isLoading,
    hasMore,
    fetchFollowing,
    loadMore,
  };
}

export function useSearchUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await usersApi.searchUsers(query);
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Search users error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setUsers([]);
  }, []);

  return {
    users,
    isLoading,
    searchUsers,
    clearSearch,
  };
}