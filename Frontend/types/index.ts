// types/index.ts

// ============ API Types ============
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  statusCode: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

// ============ Auth Types ============
export interface LoginRequest {
  phone: string;
}

export interface VerifyCodeRequest {
  phone: string;
  code: string;
}

export interface RegisterRequest {
  phone?: string;
  username: string;
  displayName: string;
  email?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  isNewUser: boolean;
}

// ============ User Types ============
export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  phone?: string;
  avatar?: string;
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
  posts?: Post[];
}

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
}

export interface UserListItem {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  isVerified: boolean;
  isFollowing?: boolean;
}

export interface UpdateProfileRequest {
  displayName?: string;
  username?: string;
  bio?: string;
  avatar?: string;
}

// ============ Post Types ============
export interface Post {
  id: string;
  userId: string;
  user: PostUser;
  content: string;
  mediaType: 'image' | 'video' | 'text';
  mediaUrl?: string;
  thumbnailUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isVerified: boolean;
  verificationBadge?: 'human' | 'original' | 'unmodified';
  location?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isVerified: boolean;
}

export interface CreatePostInput {
  content: string;
  mediaType: 'image' | 'video' | 'text';
  mediaUri?: string;
  location?: string;
  tags?: string[];
}

export interface FeedResponse {
  posts: Post[];
  hasMore: boolean;
  cursor?: string;
}

// ============ Comment Types ============
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: CommentUser;
  content: string;
  likesCount: number;
  isLiked: boolean;
  repliesCount: number;
  parentId?: string;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isVerified: boolean;
}

export interface CreateCommentInput {
  postId: string;
  content: string;
  parentId?: string;
}

// ============ Notification Types ============
export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'reply'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  userId: string;
  actorId: string;
  actor: NotificationActor;
  postId?: string;
  commentId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationActor {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
}

// ============ Media Types ============
export interface MediaItem {
  id: string;
  uri: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
}

export interface CreatePostRequest {
  caption: string;
  media: MediaItem[];
  location?: string;
}