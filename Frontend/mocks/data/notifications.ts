// mocks/data/notifications.ts
import { Notification } from '@/types';
import { mockUsers } from './users';

// Use let for mutable data
export let mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'like',
    userId: 'user-1',
    actorId: 'user-2',
    actor: {
      id: 'user-2',
      username: mockUsers[1].username,
      displayName: mockUsers[1].displayName,
      avatar: mockUsers[1].avatar,
    },
    postId: 'post-1',
    message: 'liked your post',
    isRead: false,
    createdAt: '2024-12-03T19:30:00Z',
  },
  {
    id: 'notif-2',
    type: 'follow',
    userId: 'user-1',
    actorId: 'user-3',
    actor: {
      id: 'user-3',
      username: mockUsers[2].username,
      displayName: mockUsers[2].displayName,
      avatar: mockUsers[2].avatar,
    },
    message: 'started following you',
    isRead: false,
    createdAt: '2024-12-03T18:45:00Z',
  },
  {
    id: 'notif-3',
    type: 'comment',
    userId: 'user-1',
    actorId: 'user-4',
    actor: {
      id: 'user-4',
      username: mockUsers[3].username,
      displayName: mockUsers[3].displayName,
      avatar: mockUsers[3].avatar,
    },
    postId: 'post-1',
    commentId: 'comment-3',
    message: 'commented on your post',
    isRead: true,
    createdAt: '2024-12-03T17:00:00Z',
  },
];

export const getMockNotifications = (): Notification[] => {
  return [...mockNotifications];
};

export const getUnreadCount = (): number => {
  return mockNotifications.filter(n => !n.isRead).length;
};

export const markAsRead = (notificationId: string): void => {
  const index = mockNotifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    mockNotifications[index] = { ...mockNotifications[index], isRead: true };
  }
};

export const markAllAsRead = (): void => {
  mockNotifications = mockNotifications.map(n => ({ ...n, isRead: true }));
};