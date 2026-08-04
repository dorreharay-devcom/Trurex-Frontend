import { Redirect, Stack } from 'expo-router';
import { useAuth } from '~/features/auth/providers';
import { Routes } from '~/shared/config/routes';
import { Theme } from '~/shared/theme/Theme';

export default function MainLayout() {
  const { session, booting, mfaPending } = useAuth();

  if (!session) {
    if (booting) return null;
    return <Redirect href={Routes.Login} />;
  }

  if (mfaPending) {
    if (booting) return null;
    return <Redirect href={Routes.Mfa} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: Theme.colors.background },
      }}
    />
  );
}
