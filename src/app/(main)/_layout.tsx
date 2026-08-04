import { Redirect, Stack } from 'expo-router';
import { useAuth } from '~/features/auth/providers';
import { Routes } from '~/shared/config/routes';
import BrandBootLoader from '~/shared/ui/BrandBootLoader';

export default function MainLayout() {
  const { session, loading, mfaPending, mfaChecking } = useAuth();

  if (loading || mfaChecking) {
    return <BrandBootLoader />;
  }

  if (!session) {
    return <Redirect href={Routes.Login} />;
  }

  if (mfaPending) {
    return <Redirect href={Routes.Mfa} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
