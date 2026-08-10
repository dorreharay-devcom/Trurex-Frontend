import { Stack } from 'expo-router';
import { Theme } from '~/shared/theme/Theme';

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: Theme.colors.background },
        animation: 'none',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="blocked" />
      <Stack.Screen name="[collectionId]" />
    </Stack>
  );
}
