// components/post/post-list.tsx
import React, { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Post } from '@/types';
import { PostCard } from './post-card';

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  ListHeaderComponent?: React.ReactElement;
  ListEmptyComponent?: React.ReactElement;
}

export function PostList({
  posts,
  isLoading,
  isRefreshing,
  hasMore,
  onRefresh,
  onLoadMore,
  onLike,
  onSave,
  ListHeaderComponent,
  ListEmptyComponent,
}: PostListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard post={item} onLike={onLike} onSave={onSave} />
    ),
    [onLike, onSave]
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const renderFooter = () => {
    if (!hasMore || !isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    
    return (
      ListEmptyComponent || (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No posts yet</Text>
          <Text style={styles.emptySubtext}>
            Follow people to see their posts here
          </Text>
        </View>
      )
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#000"
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={posts.length === 0 ? styles.emptyContainer : undefined}
    />
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});