import '../../global.css';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '~/features/auth/providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { AppToast } from '~/shared/ui/toast/AppToast';
import BrandBootLoader from '~/shared/ui/BrandBootLoader';
import AppErrorBoundary from '~/shared/ui/AppErrorBoundary';
import { Theme } from '~/shared/theme/Theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 45_000,
      gcTime: 5 * 60_000,
    },
  },
});

export { AppErrorBoundary as ErrorBoundary };

function AuthBootGate() {
  const { booting } = useAuth();
  if (!booting) return null;
  return <BrandBootLoader />;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    'HankenGrotesk-Light': require('@assets/fonts/HankenGrotesk-Light.ttf'),
    'HankenGrotesk-Regular': require('@assets/fonts/HankenGrotesk-Regular.ttf'),
    'HankenGrotesk-Medium': require('@assets/fonts/HankenGrotesk-Medium.ttf'),
    'HankenGrotesk-SemiBold': require('@assets/fonts/HankenGrotesk-SemiBold.ttf'),
    'HankenGrotesk-Bold': require('@assets/fonts/HankenGrotesk-Bold.ttf'),
    'HankenGrotesk-ExtraBold': require('@assets/fonts/HankenGrotesk-ExtraBold.ttf'),
  });

  if (!loaded) return <BrandBootLoader />;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: Theme.colors.background }}>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { flex: 1, backgroundColor: Theme.colors.background },
            }}
          />
          <AuthBootGate />
          <AppToast />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
