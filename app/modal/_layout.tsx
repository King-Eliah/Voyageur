import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add-trip" options={{ presentation: 'modal' }} />
      <Stack.Screen name="itinerary-modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}