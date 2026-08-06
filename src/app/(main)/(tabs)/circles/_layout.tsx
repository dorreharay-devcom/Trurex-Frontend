import { Stack } from 'expo-router';
import { Theme } from '~/shared/theme/Theme';

export default function CirclesStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: Theme.colors.background },
        animation: 'fade',
      }}
    />
  );
}
