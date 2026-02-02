// services/notification.service.ts
import { Config } from '@/constants/config';
import { notificationsApi } from '@/api';
import * as mockData from '@/mocks';
import { PaginatedResponse, PaginationParams, ApiResponse } from '@/types';
import { Notification } from '@/mocks/data/notifications';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class NotificationService {
  private useMocks = Config.USE_MOCKS;
  private mockDelay = Config.MOCK_DELAY;

  async getNotifications(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return {
        success: true,
        data: {
          items: mockData.notifications,
          hasMore: false,
          total: mockData.notifications.length,
        },
      };
    }
    return notificationsApi.getNotifications(params);
  }

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return {
        success: true,
        data: { count: mockData.getUnreadCount() },
      };
    }
    return notificationsApi.getUnreadCount();
  }

  async markAsRead(notificationId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      mockData.markAsRead(notificationId);
      return { success: true, data: { success: true } };
    }
    return notificationsApi.markAsRead(notificationId);
  }

  async markAllAsRead(): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      mockData.markAllAsRead();
      return { success: true, data: { success: true } };
    }
    return notificationsApi.markAllAsRead();
  }
}

export const notificationService = new NotificationService();