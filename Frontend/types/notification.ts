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
  avatar: string;
}