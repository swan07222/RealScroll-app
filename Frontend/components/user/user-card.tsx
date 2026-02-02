// components/user/user-card.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { User } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/utils/helpers';

interface UserCardProps {
  user: User;
  showFollowButton?: boolean;
  isFollowing?: boolean;
  onFollowPress?: () => void;
  onPress?: () => void;
}

export function UserCard({
  user,
  showFollowButton = false,
  isFollowing = false,
  onFollowPress,
  onPress,
}: UserCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/(screens)/user/${user.id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Avatar uri={user.avatar} size={50} showVerified={user.isVerified} />
      
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.displayName} numberOfLines={1}>
            {user.displayName}
          </Text>
        </View>
        <Text style={styles.username} numberOfLines={1}>
          @{user.username}
        </Text>
        {user.bio && (
          <Text style={styles.bio} numberOfLines={1}>
            {user.bio}
          </Text>
        )}
      </View>

      {showFollowButton && (
        <Button
          title={isFollowing ? 'Following' : 'Follow'}
          variant={isFollowing ? 'outline' : 'primary'}
          size="small"
          onPress={() => onFollowPress?.()}
          style={styles.followButton}
        />
      )}
    </TouchableOpacity>
  );
}

export function UserCardCompact({
  user,
  onPress,
}: {
  user: User;
  onPress?: () => void;
}) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/(screens)/user/${user.id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.compactContainer} onPress={handlePress}>
      <Avatar uri={user.avatar} size={36} showVerified={user.isVerified} />
      <View style={styles.compactInfo}>
        <Text style={styles.compactName} numberOfLines={1}>
          {user.displayName}
        </Text>
        <Text style={styles.compactUsername} numberOfLines={1}>
          @{user.username}
        </Text>
      </View>
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
  info: {
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
  username: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  bio: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  followButton: {
    marginLeft: 12,
  },
  
  // Compact variant
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  compactInfo: {
    marginLeft: 10,
  },
  compactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  compactUsername: {
    fontSize: 12,
    color: '#666',
  },
});