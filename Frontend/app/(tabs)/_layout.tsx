// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { useNotifications } from '@/hooks/use-notifications';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  color: string;
  focused: boolean;
}

export default function TabLayout(): React.ReactElement {
  const { unreadCount } = useNotifications();

  const renderHomeIcon = ({ color, focused }: TabIconProps): React.ReactElement => (
    <Ionicons
      name={focused ? 'home' : 'home-outline'}
      size={24}
      color={color}
    />
  );

  const renderSearchIcon = ({ color, focused }: TabIconProps): React.ReactElement => (
    <Ionicons
      name={focused ? 'search' : 'search-outline'}
      size={24}
      color={color}
    />
  );

  const renderCreateIcon = (): React.ReactElement => (
    <View style={styles.createButton}>
      <Ionicons name="add" size={28} color="#fff" />
    </View>
  );

  const renderNotificationsIcon = ({ color, focused }: TabIconProps): React.ReactElement => (
    <View>
      <Ionicons
        name={focused ? 'heart' : 'heart-outline'}
        size={24}
        color={color}
      />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );

  const renderProfileIcon = ({ color, focused }: TabIconProps): React.ReactElement => (
    <Ionicons
      name={focused ? 'person' : 'person-outline'}
      size={24}
      color={color}
    />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: renderSearchIcon,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: renderCreateIcon,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarIcon: renderNotificationsIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    height: 85,
    paddingTop: 10,
  },
  createButton: {
    width: 44,
    height: 44,
    backgroundColor: '#000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});