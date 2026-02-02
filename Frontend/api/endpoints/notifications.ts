// api/endpoints/notifications.ts
import { Config } from '@/constants/config';
import { ApiResponse, PaginatedResponse, Notification } from '@/types';
import { apiClient } from '../client';
import { mockNotificationHandlers } from '@/mocks';

export const notificationsApi = {
  async getNotifications(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Notification>> {
    if (Config.USE_MOCKS) {
      return mockNotificationHandlers.getNotifications(page, limit);
    }
    return apiClient.get(`/notifications?page=${page}&limit=${limit}`) as Promise<PaginatedResponse<Notification>>;
  },

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    if (Config.USE_MOCKS) {
      return mockNotificationHandlers.getUnreadCount();
    }
    return apiClient.get('/notifications/unread-count');
  },

  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    if (Config.USE_MOCKS) {
      return mockNotificationHandlers.markAsRead(notificationId);
    }
    return apiClient.patch(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<ApiResponse<null>> {
    if (Config.USE_MOCKS) {
      return mockNotificationHandlers.markAllAsRead();
    }
    return apiClient.post('/notifications/read-all');
  },

  async deleteNotification(notificationId: string): Promise<ApiResponse<null>> {
    if (Config.USE_MOCKS) {
      return mockNotificationHandlers.deleteNotification(notificationId);
    }
    return apiClient.delete(`/notifications/${notificationId}`);
  },
};