// mocks/handlers/notifications.ts
import { ApiResponse, PaginatedResponse, Notification } from '@/types';
import { mockNotifications } from '../data/notifications';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let notifications = [...mockNotifications];

export const mockNotificationHandlers = {
  async getNotifications(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Notification>> {
    await delay(400);
    
    const start = (page - 1) * limit;
    const paginatedNotifications = notifications.slice(start, start + limit);
    
    return {
      success: true,
      data: paginatedNotifications,
      pagination: {
        page,
        limit,
        total: notifications.length,
        totalPages: Math.ceil(notifications.length / limit),
        hasNext: start + limit < notifications.length,
        hasPrev: page > 1,
      },
    };
  },

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    await delay(200);
    
    const count = notifications.filter(n => !n.isRead).length;
    
    return {
      success: true,
      data: { count },
    };
  },

  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    await delay(200);
    
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Notification not found',
      };
    }
    
    notifications[index] = {
      ...notifications[index],
      isRead: true,
    };
    
    return {
      success: true,
      data: notifications[index],
    };
  },

  async markAllAsRead(): Promise<ApiResponse<null>> {
    await delay(300);
    
    notifications = notifications.map(n => ({ ...n, isRead: true }));
    
    return {
      success: true,
      data: null,
      message: 'All notifications marked as read',
    };
  },

  async deleteNotification(notificationId: string): Promise<ApiResponse<null>> {
    await delay(200);
    
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications.splice(index, 1);
    }
    
    return {
      success: true,
      data: null,
    };
  },
};