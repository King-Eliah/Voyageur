import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="edit" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="help" />
      <Stack.Screen name="about" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="stats" />
      <Stack.Screen name="add-card" />
    </Stack>
  );
}