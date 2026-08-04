import { Redirect, Stack, usePathname } from 'expo-router';
import { useAuth } from '~/features/auth/providers';
import { Routes } from '~/shared/config/routes';
import BrandBootLoader from '~/shared/ui/BrandBootLoader';

const SIGNED_IN_ALLOWED_AUTH_ROUTES: readonly string[] = [
  Routes.ResetPassword,
  Routes.Mfa,
  Routes.Terms,
  Routes.CommunityGuidelines,
  Routes.Privacy,
];

export default function AuthLayout() {
  const { session, loading, mfaPending, mfaChecking } = useAuth();
  const pathname = usePathname();

  if (loading || mfaChecking) {
    return <BrandBootLoader />;
  }

  if (session && mfaPending && pathname !== Routes.Mfa) {
    return <Redirect href={Routes.Mfa} />;
  }

  if (session && !mfaPending && !SIGNED_IN_ALLOWED_AUTH_ROUTES.includes(pathname)) {
    return <Redirect href={Routes.Main} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
