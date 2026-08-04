import { Redirect, Stack, usePathname } from 'expo-router';
import { useAuth } from '~/features/auth/providers';
import { Routes } from '~/shared/config/routes';
import { Theme } from '~/shared/theme/Theme';

const SIGNED_IN_ALLOWED_AUTH_ROUTES: readonly string[] = [
  Routes.ResetPassword,
  Routes.Mfa,
  Routes.Terms,
  Routes.CommunityGuidelines,
  Routes.Privacy,
];

export default function AuthLayout() {
  const { session, booting, mfaPending } = useAuth();
  const pathname = usePathname();

  if (booting) return null;

  if (session && mfaPending && pathname !== Routes.Mfa) {
    return <Redirect href={Routes.Mfa} />;
  }

  if (session && !mfaPending && !SIGNED_IN_ALLOWED_AUTH_ROUTES.includes(pathname)) {
    return <Redirect href={Routes.Main} />;
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
