// app/(tabs)/profile.tsx
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useAuth } from '@/hooks/use-auth';
import { useUserPosts } from '@/hooks/use-user';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { formatNumber } from '@/utils/helpers';
import { Post } from '@/types';

const { width } = Dimensions.get('window');
const imageSize = (width - 4) / 3;

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { posts, isLoading, fetchPosts } = useUserPosts(user?.id || '');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchPosts();
    }
  }, [user?.id, fetchPosts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts(1);
    setRefreshing(false);
  };

  const handleSettings = () => {
    router.push('/(screens)/settings');
  };

  const handleEditProfile = () => {
    router.push('/(screens)/edit-profile');
  };

  const handlePostPress = (post: Post) => {
    router.push(`/(screens)/post/${post.id}`);
  };

  if (!user) {
    return <Loading fullScreen />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#000" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.username}>@{user.username}</Text>
          <TouchableOpacity onPress={handleSettings}>
            <Ionicons name="menu-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Avatar uri={user.avatar} size={90} showVerified={user.isVerified} />
          
          <Text style={styles.displayName}>{user.displayName}</Text>
          
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(user.postsCount)}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => router.push(`/(screens)/user/${user.id}/followers`)}
            >
              <Text style={styles.statNumber}>{formatNumber(user.followersCount)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statItem}
              onPress={() => router.push(`/(screens)/user/${user.id}/following`)}
            >
              <Text style={styles.statNumber}>{formatNumber(user.followingCount)}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Edit Profile"
              variant="secondary"
              onPress={handleEditProfile}
              style={styles.editButton}
            />
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsSection}>
          <View style={styles.postsTabs}>
            <TouchableOpacity style={[styles.postsTab, styles.postsTabActive]}>
              <Ionicons name="grid-outline" size={22} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postsTab}>
              <Ionicons name="bookmark-outline" size={22} color="#999" />
            </TouchableOpacity>
          </View>

          {isLoading && posts.length === 0 ? (
            <Loading text="Loading posts..." />
          ) : posts.length === 0 ? (
            <View style={styles.emptyPosts}>
              <Ionicons name="camera-outline" size={48} color="#ddd" />
              <Text style={styles.emptyTitle}>No posts yet</Text>
              <Text style={styles.emptyText}>Share your first real moment</Text>
              <Button
                title="Create Post"
                onPress={() => router.push('/(tabs)/create')}
                style={styles.createButton}
              />
            </View>
          ) : (
            <View style={styles.postsGrid}>
              {posts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postItem}
                  onPress={() => handlePostPress(post)}
                >
                  <Image
                    source={{ uri: post.mediaUrl || post.thumbnailUrl }}
                    style={styles.postImage}
                    contentFit="cover"
                  />
                  {post.mediaType === 'video' && (
                    <View style={styles.videoIcon}>
                      <Ionicons name="play" size={16} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginTop: 12,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  editButton: {
    flex: 1,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postsSection: {
    flex: 1,
  },
  postsTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  postsTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
  },
  postsTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postItem: {
    width: imageSize,
    height: imageSize,
    margin: 0.5,
  },
  postImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  videoIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    padding: 4,
  },
  emptyPosts: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  createButton: {
    paddingHorizontal: 32,
  },
});