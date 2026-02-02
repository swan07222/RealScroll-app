// hooks/use-notifications.ts
import { useState, useCallback, useEffect } from 'react';
import { Notification } from '@/types';
import { notificationsApi } from '@/api';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = useCallback(async (pageNum: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await notificationsApi.getNotifications(pageNum);
      if (response.success) {
        if (pageNum === 1) {
          setNotifications(response.data);
        } else {
          setNotifications(prev => [...prev, ...response.data]);
        }
        setPage(pageNum);
        setHasMore(response.pagination.hasNext);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationsApi.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (err) {
      console.error('Fetch unread count error:', err);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchNotifications(page + 1);
    }
  }, [isLoading, hasMore, page, fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await notificationsApi.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Mark as read error:', err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await notificationsApi.markAllAsRead();
      if (response.success) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Mark all as read error:', err);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await notificationsApi.deleteNotification(notificationId);
      if (response.success) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Delete notification error:', err);
    }
  }, [notifications]);

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    hasMore,
    fetchNotifications,
    fetchUnreadCount,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}