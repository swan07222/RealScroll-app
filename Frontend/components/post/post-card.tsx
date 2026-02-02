// components/post/post-card.tsx
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Post } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { formatTimeAgo, formatNumber } from '@/utils/helpers';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onUserPress?: (userId: string) => void;
}

export const PostCard = memo(function PostCard({
  post,
  onLike,
  onSave,
  onComment,
  onShare,
  onUserPress,
}: PostCardProps) {
  const handleUserPress = () => {
    if (onUserPress) {
      onUserPress(post.userId);
    } else {
      router.push(`/(screens)/user/${post.userId}`);
    }
  };

  const handlePostPress = () => {
    router.push(`/(screens)/post/${post.id}`);
  };

  const handleCommentPress = () => {
    if (onComment) {
      onComment(post.id);
    } else {
      router.push(`/(screens)/comments/${post.id}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={handleUserPress}>
        <Avatar
          uri={post.user.avatar}
          size={40}
          showVerified={post.user.isVerified}
        />
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{post.user.displayName}</Text>
            {post.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={14} color="#22C55E" />
              </View>
            )}
          </View>
          <Text style={styles.username}>
            @{post.user.username} · {formatTimeAgo(post.createdAt)}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Content */}
      {post.content && (
        <TouchableOpacity onPress={handlePostPress}>
          <Text style={styles.content}>{post.content}</Text>
        </TouchableOpacity>
      )}

      {/* Media */}
      {post.mediaUrl && (
        <TouchableOpacity onPress={handlePostPress}>
          <Image
            source={{ uri: post.mediaUrl }}
            style={styles.media}
            contentFit="cover"
            transition={200}
          />
        </TouchableOpacity>
      )}

      {/* Location */}
      {post.location && (
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.locationText}>{post.location}</Text>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike(post.id)}
        >
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={post.isLiked ? '#ef4444' : '#000'}
          />
          <Text style={styles.actionCount}>{formatNumber(post.likesCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCommentPress}
        >
          <Ionicons name="chatbubble-outline" size={22} color="#000" />
          <Text style={styles.actionCount}>{formatNumber(post.commentsCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare?.(post.id)}
        >
          <Ionicons name="paper-plane-outline" size={22} color="#000" />
          <Text style={styles.actionCount}>{formatNumber(post.sharesCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onSave(post.id)}
        >
          <Ionicons
            name={post.isSaved ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color="#000"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  username: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  media: {
    width: width,
    height: width,
    backgroundColor: '#f0f0f0',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionCount: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
});