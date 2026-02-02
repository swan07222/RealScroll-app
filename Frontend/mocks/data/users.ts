// mocks/data/users.ts
import { User, AuthUser } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'johndoe',
    displayName: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    avatar: 'https://i.pravatar.cc/150?u=user-1',
    bio: 'Photography enthusiast 📸 | Travel lover ✈️ | Real moments only',
    isVerified: true,
    followersCount: 1234,
    followingCount: 567,
    postsCount: 89,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-12-01T15:45:00Z',
  },
  {
    id: 'user-2',
    username: 'janedoe',
    displayName: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+1987654321',
    avatar: 'https://i.pravatar.cc/150?u=user-2',
    bio: 'Artist & Creator 🎨 | Living life unfiltered',
    isVerified: true,
    followersCount: 5678,
    followingCount: 234,
    postsCount: 156,
    createdAt: '2024-02-20T08:15:00Z',
    updatedAt: '2024-12-02T09:30:00Z',
  },
  {
    id: 'user-3',
    username: 'mike_smith',
    displayName: 'Mike Smith',
    email: 'mike@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user-3',
    bio: 'Foodie 🍕 | Chef in training',
    isVerified: false,
    followersCount: 890,
    followingCount: 432,
    postsCount: 67,
    createdAt: '2024-03-10T14:20:00Z',
    updatedAt: '2024-11-28T11:00:00Z',
  },
  {
    id: 'user-4',
    username: 'sarah_wilson',
    displayName: 'Sarah Wilson',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user-4',
    bio: 'Fitness & Wellness 💪 | Yoga instructor',
    isVerified: true,
    followersCount: 12500,
    followingCount: 180,
    postsCount: 234,
    createdAt: '2024-01-05T06:45:00Z',
    updatedAt: '2024-12-03T08:15:00Z',
  },
  {
    id: 'user-5',
    username: 'alex_chen',
    displayName: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://i.pravatar.cc/150?u=user-5',
    bio: 'Tech enthusiast 💻 | Building the future',
    isVerified: true,
    followersCount: 3456,
    followingCount: 289,
    postsCount: 78,
    createdAt: '2024-02-28T12:00:00Z',
    updatedAt: '2024-12-01T16:30:00Z',
  },
];

export const mockCurrentUser: AuthUser = {
  ...mockUsers[0],
  token: 'mock-jwt-token-12345',
  refreshToken: 'mock-refresh-token-67890',
};

export const getMockUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getMockUserByUsername = (username: string): User | undefined => {
  return mockUsers.find(user => user.username === username);
};