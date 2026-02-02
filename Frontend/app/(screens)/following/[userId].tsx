// app/(screens)/following/[userId].tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFollowing } from '@/hooks/use-user';
import { UserCard } from '@/components/user/user-card';
import { Loading } from '@/components/ui/loading';
import { User } from '@/types';

export default function FollowingScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { following, isLoading, hasMore, fetchFollowing, loadMore } = useFollowing(userId);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFollowing(1);
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: User }) => (
    <UserCard
      user={item}
      showFollowButton
      onPress={() => router.push({
        pathname: '/(screens)/user/[id]',
        params: { id: item.id }
      })}
    />
  );

  if (isLoading && following.length === 0) {
    return <Loading fullScreen text="Loading..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Following</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={following}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#000"
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Not following anyone yet</Text>
          </View>
        }
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});