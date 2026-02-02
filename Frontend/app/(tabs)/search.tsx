// app/(tabs)/search.tsx
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSearchUsers } from '@/hooks/use-user';
import { usePosts } from '@/hooks/use-posts';
import { UserCard } from '@/components/user/user-card';
import { PostCard } from '@/components/post/post-card';
import { User, Post } from '@/types';
import debounce from 'lodash.debounce';

type TabType = 'users' | 'posts';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const { users, isLoading: usersLoading, searchUsers, clearSearch } = useSearchUsers();
  const { posts, isLoading: postsLoading, likePost, savePost } = usePosts();

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      if (text.trim()) {
        searchUsers(text);
      } else {
        clearSearch();
      }
    }, 300),
    []
  );

  const handleSearch = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <UserCard
      user={item}
      showFollowButton
      onPress={() => router.push(`/(screens)/user/${item.id}`)}
    />
  );

  const renderPostItem = ({ item }: { item: Post }) => (
    <PostCard post={item} onLike={likePost} onSave={savePost} />
  );

  const isLoading = activeTab === 'users' ? usersLoading : postsLoading;
  const data = activeTab === 'users' ? users : posts.filter(p => 
    p.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users, posts..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.tabActive]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.tabActive]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
            Posts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : query.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color="#ddd" />
          <Text style={styles.emptyTitle}>Search RealScroll</Text>
          <Text style={styles.emptyText}>
            Find people, posts, and more
          </Text>
        </View>
      ) : data.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptyText}>
            Try searching for something else
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={activeTab === 'users' ? renderUserItem : renderPostItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF9',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#999',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
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
    textAlign: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
});