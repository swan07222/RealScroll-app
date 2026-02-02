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
  isVerified: boolean; // Content verification status
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
  avatar: string;
  isVerified: boolean;
}

export interface CreatePostInput {
  content: string;
  mediaType: 'image' | 'video' | 'text';
  mediaUri?: string;
  location?: string;
  tags?: string[];
}