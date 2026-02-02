// services/notification.service.ts
import { Config } from '@/constants/config';
import { notificationsApi } from '@/api';
import { 
  getMockNotifications, 
  getUnreadCount as getMockUnreadCount,
  markAsRead as mockMarkAsRead,
  markAllAsRead as mockMarkAllAsRead,
} from '@/mocks';
import { PaginatedResponse, PaginationParams, ApiResponse, Notification } from '@/types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class NotificationService {
  private useMocks = Config.USE_MOCKS;
  private mockDelay = Config.MOCK_DELAY;

  async getNotifications(params?: PaginationParams): Promise<PaginatedResponse<Notification>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      const notifications = getMockNotifications();
      return {
        success: true,
        data: notifications,
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          total: notifications.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
    return notificationsApi.getNotifications(params?.page, params?.limit);
  }

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      return {
        success: true,
        data: { count: getMockUnreadCount() },
      };
    }
    return notificationsApi.getUnreadCount();
  }

  async markAsRead(notificationId: string): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      mockMarkAsRead(notificationId);
      return { success: true, data: { success: true } };
    }
    const response = await notificationsApi.markAsRead(notificationId);
    return { success: response.success, data: { success: response.success } };
  }

  async markAllAsRead(): Promise<ApiResponse<{ success: boolean }>> {
    if (this.useMocks) {
      await delay(this.mockDelay);
      mockMarkAllAsRead();
      return { success: true, data: { success: true } };
    }
    const response = await notificationsApi.markAllAsRead();
    return { success: response.success, data: { success: response.success } };
  }
}

export const notificationService = new NotificationService();