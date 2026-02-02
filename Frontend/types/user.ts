export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone?: string;
  avatar: string;
  bio?: string;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  isFollowing: boolean;
  isFollowedBy: boolean;
  posts: Post[];
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

import { Post } from './post';