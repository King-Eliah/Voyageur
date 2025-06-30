import { Stack } from 'expo-router';

export default function ExploreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="featured" />
      <Stack.Screen name="popular" />
      <Stack.Screen name="recommended" />
      <Stack.Screen name="destination/[id]" />
    </Stack>
  );
}