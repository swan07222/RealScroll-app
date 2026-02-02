// components/notification/notification-item.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Notification, NotificationType } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { formatTimeAgo } from '@/utils/helpers';

interface NotificationItemProps {
  notification: Notification;
  onPress?: () => void;
}

const getNotificationIcon = (type: NotificationType): {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
} => {
  switch (type) {
    case 'like':
      return { name: 'heart', color: '#ef4444', backgroundColor: '#fef2f2' };
    case 'comment':
      return { name: 'chatbubble', color: '#3b82f6', backgroundColor: '#eff6ff' };
    case 'follow':
      return { name: 'person-add', color: '#8b5cf6', backgroundColor: '#f5f3ff' };
    case 'mention':
      return { name: 'at', color: '#22c55e', backgroundColor: '#f0fdf4' };
    case 'reply':
      return { name: 'arrow-undo', color: '#f59e0b', backgroundColor: '#fffbeb' };
    case 'system':
      return { name: 'notifications', color: '#6b7280', backgroundColor: '#f3f4f6' };
    default:
      return { name: 'notifications', color: '#6b7280', backgroundColor: '#f3f4f6' };
  }
};

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const icon = getNotificationIcon(notification.type);

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    // Navigate based on notification type
    if (notification.postId) {
      router.push(`/(screens)/post/${notification.postId}`);
    } else if (notification.type === 'follow') {
      router.push(`/(screens)/user/${notification.actorId}`);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.isRead && styles.unread,
      ]}
      onPress={handlePress}
    >
      <View style={styles.avatarContainer}>
        <Avatar uri={notification.actor.avatar} size={44} />
        <View
          style={[
            styles.iconBadge,
            { backgroundColor: icon.backgroundColor },
          ]}
        >
          <Ionicons name={icon.name} size={12} color={icon.color} />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.actorName}>{notification.actor.displayName}</Text>
          {' '}
          {notification.message}
        </Text>
        <Text style={styles.time}>{formatTimeAgo(notification.createdAt)}</Text>
      </View>

      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unread: {
    backgroundColor: '#fafafa',
  },
  avatarContainer: {
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000',
  },
  actorName: {
    fontWeight: '600',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginLeft: 8,
  },
});