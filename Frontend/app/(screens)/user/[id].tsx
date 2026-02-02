// app/(screens)/user/[id].tsx
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
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useUserProfile, useUserPosts } from '@/hooks/use-user';
import { useAuth } from '@/hooks/use-auth';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { formatNumber } from '@/utils/helpers';
import { Post } from '@/types';

const { width } = Dimensions.get('window');
const imageSize = (width - 4) / 3;

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const { profile, isLoading, error, fetchProfile, toggleFollow } = useUserProfile(id);
  const { posts, fetchPosts } = useUserPosts(id);
  const [refreshing, setRefreshing] = useState(false);

  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [fetchProfile, fetchPosts]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchProfile(), fetchPosts(1)]);
    setRefreshing(false);
  };

  const handlePostPress = (post: Post) => {
    router.push(`/(screens)/post/${post.id}`);
  };

  if (isLoading && !profile) {
    return <Loading fullScreen />;
  }

  if (error || !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>@{profile.username}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#000" />
        }
      >
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Avatar uri={profile.avatar} size={90} showVerified={profile.isVerified} />

          <Text style={styles.displayName}>{profile.displayName}</Text>

          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(profile.postsCount)}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(profile.followersCount)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{formatNumber(profile.followingCount)}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          {!isOwnProfile && (
            <View style={styles.actionButtons}>
              <Button
                title={profile.isFollowing ? 'Following' : 'Follow'}
                variant={profile.isFollowing ? 'outline' : 'primary'}
                onPress={toggleFollow}
                style={styles.followButton}
              />
              <TouchableOpacity style={styles.messageButton}>
                <Ionicons name="chatbubble-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Posts Grid */}
        <View style={styles.postsSection}>
          <View style={styles.postsTabs}>
            <TouchableOpacity style={[styles.postsTab, styles.postsTabActive]}>
              <Ionicons name="grid-outline" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {posts.length === 0 ? (
            <View style={styles.emptyPosts}>
              <Ionicons name="camera-outline" size={48} color="#ddd" />
              <Text style={styles.emptyTitle}>No posts yet</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
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
  followButton: {
    flex: 1,
  },
  messageButton: {
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
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
});