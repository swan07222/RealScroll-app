// app/(screens)/comments/[postId].tsx
import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useComments } from '@/hooks/use-comments';
import { Avatar } from '@/components/ui/avatar';
import { Loading } from '@/components/ui/loading';
import { formatTimeAgo } from '@/utils/helpers';
import { Comment } from '@/types';

export default function CommentsScreen() {
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const {
    comments,
    isLoading,
    isSubmitting,
    hasMore,
    fetchComments,
    loadMore,
    addComment,
    likeComment,
  } = useComments(postId);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment(newComment.trim(), replyingTo?.id);
      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Add comment error:', error);
    }
  };

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment);
    inputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <TouchableOpacity onPress={() => router.push(`/(screens)/user/${item.userId}`)}>
        <Avatar uri={item.user.avatar} size={36} showVerified={item.user.isVerified} />
      </TouchableOpacity>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>{item.user.displayName}</Text>
          <Text style={styles.commentTime}>{formatTimeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.commentText}>{item.content}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity
            style={styles.commentAction}
            onPress={() => likeComment(item.id)}
          >
            <Ionicons
              name={item.isLiked ? 'heart' : 'heart-outline'}
              size={16}
              color={item.isLiked ? '#ef4444' : '#666'}
            />
            <Text style={styles.commentActionText}>{item.likesCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.commentAction}
            onPress={() => handleReply(item)}
          >
            <Text style={styles.commentActionText}>Reply</Text>
          </TouchableOpacity>
        </View>

        {/* Replies */}
        {item.replies && item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {item.replies.map((reply) => (
              <View key={reply.id} style={styles.replyItem}>
                <Avatar uri={reply.user.avatar} size={28} />
                <View style={styles.replyContent}>
                  <Text style={styles.replyUsername}>{reply.user.displayName}</Text>
                  <Text style={styles.replyText}>{reply.content}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        {/* Comments List */}
        {isLoading && comments.length === 0 ? (
          <Loading text="Loading comments..." />
        ) : (
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No comments yet</Text>
                <Text style={styles.emptySubtext}>Be the first to comment</Text>
              </View>
            }
          />
        )}

        {/* Reply Indicator */}
        {replyingTo && (
          <View style={styles.replyIndicator}>
            <Text style={styles.replyIndicatorText}>
              Replying to{' '}
              <Text style={styles.replyIndicatorName}>{replyingTo.user.displayName}</Text>
            </Text>
            <TouchableOpacity onPress={cancelReply}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={replyingTo ? 'Write a reply...' : 'Add a comment...'}
            placeholderTextColor="#999"
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !newComment.trim() && styles.sendButtonDisabled]}
            onPress={handleSubmit}
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Ionicons
                name="send"
                size={20}
                color={newComment.trim() ? '#000' : '#ccc'}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
    marginTop: 4,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#f0f0f0',
  },
  replyItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  replyContent: {
    flex: 1,
    marginLeft: 8,
  },
  replyUsername: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  replyText: {
    fontSize: 13,
    color: '#000',
    lineHeight: 18,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  replyIndicatorText: {
    fontSize: 13,
    color: '#666',
  },
  replyIndicatorName: {
    fontWeight: '600',
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    maxHeight: 100,
    color: '#000',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});