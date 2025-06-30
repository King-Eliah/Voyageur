import { Stack } from 'expo-router';

export default function BookingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="hotels" />
      <Stack.Screen name="flights" />
      <Stack.Screen name="cars" />
      <Stack.Screen name="activities" />
    </Stack>
  );
}