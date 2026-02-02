// mocks/data/comments.ts
import { Comment } from '@/types';
import { mockUsers } from './users';

export const mockComments: Record<string, Comment[]> = {
  'post-1': [
    {
      id: 'comment-1',
      postId: 'post-1',
      userId: 'user-2',
      user: {
        id: 'user-2',
        username: mockUsers[1].username,
        displayName: mockUsers[1].displayName,
        avatar: mockUsers[1].avatar,
        isVerified: mockUsers[1].isVerified,
      },
      content: 'This is absolutely stunning! 😍',
      likesCount: 12,
      isLiked: false,
      repliesCount: 2,
      createdAt: '2024-12-03T18:35:00Z',
      updatedAt: '2024-12-03T18:35:00Z',
      replies: [
        {
          id: 'comment-1-reply-1',
          postId: 'post-1',
          userId: 'user-1',
          user: {
            id: 'user-1',
            username: mockUsers[0].username,
            displayName: mockUsers[0].displayName,
            avatar: mockUsers[0].avatar,
            isVerified: mockUsers[0].isVerified,
          },
          content: 'Thank you so much! 🙏',
          likesCount: 5,
          isLiked: true,
          repliesCount: 0,
          parentId: 'comment-1',
          createdAt: '2024-12-03T18:40:00Z',
          updatedAt: '2024-12-03T18:40:00Z',
        },
      ],
    },
    {
      id: 'comment-2',
      postId: 'post-1',
      userId: 'user-3',
      user: {
        id: 'user-3',
        username: mockUsers[2].username,
        displayName: mockUsers[2].displayName,
        avatar: mockUsers[2].avatar,
        isVerified: mockUsers[2].isVerified,
      },
      content: 'Where exactly was this taken? I need to visit!',
      likesCount: 8,
      isLiked: false,
      repliesCount: 1,
      createdAt: '2024-12-03T18:45:00Z',
      updatedAt: '2024-12-03T18:45:00Z',
    },
  ],
};

export const getMockCommentsByPostId = (postId: string): Comment[] => {
  return mockComments[postId] || [];
};

export const generateMockComments = (postId: string, count: number): Comment[] => {
  return Array.from({ length: count }, (_, i) => {
    const userIndex = i % mockUsers.length;
    const user = mockUsers[userIndex];
    return {
      id: `comment-generated-${postId}-${i}`,
      postId,
      userId: user.id,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
      content: `This is comment #${i + 1} on this post!`,
      likesCount: Math.floor(Math.random() * 50),
      isLiked: Math.random() > 0.5,
      repliesCount: Math.floor(Math.random() * 5),
      createdAt: new Date(Date.now() - i * 600000).toISOString(),
      updatedAt: new Date(Date.now() - i * 600000).toISOString(),
    };
  });
};