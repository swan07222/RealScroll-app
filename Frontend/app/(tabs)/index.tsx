// app/(tabs)/index.tsx
import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PostList } from '@/components/post/post-list';
import { usePosts } from '@/hooks/use-posts';
import { Loading } from '@/components/ui/loading';

export default function HomeScreen() {
  const {
    posts,
    isLoading,
    isRefreshing,
    hasMore,
    fetchPosts,
    loadMore,
    refresh,
    likePost,
    savePost,
  } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Ionicons name="cube" size={22} color="#000" />
      </View>
    </View>
  );

  if (isLoading && posts.length === 0) {
    return <Loading fullScreen text="Loading feed..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <PostList
        posts={posts}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        hasMore={hasMore}
        onRefresh={refresh}
        onLoadMore={loadMore}
        onLike={likePost}
        onSave={savePost}
        ListHeaderComponent={renderHeader()}
      />
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
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});