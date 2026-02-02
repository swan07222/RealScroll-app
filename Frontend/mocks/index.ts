// mocks/index.ts
export { mockAuthHandlers } from './handlers/auth';
export { mockPostHandlers } from './handlers/posts';
export { mockUserHandlers } from './handlers/users';
export { mockCommentHandlers } from './handlers/comments';
export { mockNotificationHandlers } from './handlers/notifications';

// Re-export mock data for direct access if needed
export * from './data/users';
export * from './data/posts';
export * from './data/comments';
export * from './data/notifications';