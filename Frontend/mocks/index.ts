// mocks/index.ts
export { mockAuthHandlers } from './handlers/auth';
export { mockPostHandlers } from './handlers/posts';
export { mockUserHandlers } from './handlers/users';
export { mockCommentHandlers } from './handlers/comments';
export { mockNotificationHandlers } from './handlers/notifications';

// Re-export mock data
export { mockUsers, mockCurrentUser, getMockUserById, getMockUserByUsername } from './data/users';
export { mockPosts, generateMockPosts, getMockPostById, getMockPostsByUserId } from './data/posts';
export { mockComments, getMockCommentsByPostId, generateMockComments } from './data/comments';
export { 
  mockNotifications, 
  getMockNotifications, 
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from './data/notifications';

// Import for internal use
import { mockUsers, mockCurrentUser } from './data/users';
import { mockPosts, getMockPostsByUserId } from './data/posts';
import { generateMockComments } from './data/comments';

export const currentUser = mockCurrentUser;

export const suggestedUsers = mockUsers.slice(1, 5).map(user => ({
  ...user,
  isFollowing: Math.random() > 0.5,
}));

export function getUserById(userId: string) {
  return mockUsers.find(u => u.id === userId) || null;
}

export function searchUsers(query: string) {
  const lowerQuery = query.toLowerCase();
  return mockUsers.filter(
    u =>
      u.username.toLowerCase().includes(lowerQuery) ||
      u.displayName.toLowerCase().includes(lowerQuery)
  );
}

export function getFeed(cursor?: string, limit: number = 10) {
  const startIndex = cursor ? parseInt(cursor, 10) : 0;
  const posts = mockPosts.slice(startIndex, startIndex + limit);
  return {
    posts,
    hasMore: startIndex + limit < mockPosts.length + 50,
    cursor: String(startIndex + limit),
  };
}

export function getExplorePosts() {
  return [...mockPosts].sort(() => Math.random() - 0.5);
}

export function getPostById(postId: string) {
  return mockPosts.find(p => p.id === postId) || null;
}

export function getUserPosts(userId: string) {
  return getMockPostsByUserId(userId);
}

// Export with a different name to avoid confusion
export function generateCommentsList(postId: string, count: number = 5) {
  return generateMockComments(postId, count);
}