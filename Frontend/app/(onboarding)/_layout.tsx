// app/(onboarding)/_layout.tsx
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFCF9' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="phone" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="verifying" />
      <Stack.Screen name="verified" />
      <Stack.Screen name="verification-error" />
      <Stack.Screen name="setup-username" />
      <Stack.Screen name="claim-username" />
      <Stack.Screen name="claim-submitted" />
      <Stack.Screen name="slides" />
    </Stack>
  );
}