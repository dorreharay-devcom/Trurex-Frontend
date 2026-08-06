import { Redirect, Slot } from 'expo-router';
import { useAuth } from '~/features/auth/providers';
import { useEndAuthBoot } from '~/features/auth/hooks/useEndAuthBoot';
import { Routes } from '~/shared/config/routes';

export default function MainLayout() {
  const { session, booting, mfaPending } = useAuth();
  useEndAuthBoot();

  if (!session) {
    if (booting) return null;
    return <Redirect href={Routes.Login} />;
  }

  if (mfaPending) {
    if (booting) return null;
    return <Redirect href={Routes.Mfa} />;
  }

  return <Slot />;
}
