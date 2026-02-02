// app/(screens)/_layout.tsx
import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFCF9' },
      }}
    >
      <Stack.Screen name="post/[id]" />
      <Stack.Screen name="user/[id]" />
      <Stack.Screen name="comments/[postId]" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="followers/[userId]" />
      <Stack.Screen name="following/[userId]" />
    </Stack>
  );
}