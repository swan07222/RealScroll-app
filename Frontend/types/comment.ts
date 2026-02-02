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
  avatar: string;
  isVerified: boolean;
}

export interface CreateCommentInput {
  postId: string;
  content: string;
  parentId?: string;
}