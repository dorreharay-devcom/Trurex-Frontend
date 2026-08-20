import 'react-native-gesture-handler';
import '../../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '~/features/auth/providers';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useFonts } from 'expo-font';
import { AppToast } from '~/shared/ui/toast/AppToast';
import BrandBootLoader from '~/shared/ui/shell/BrandBootLoader';
import AppErrorBoundary from '~/shared/ui/shell/AppErrorBoundary';
import { setupQueryNetwork } from '~/shared/lib/query/setupQueryNetwork';
import { queryClient, queryPersister } from '~/shared/lib/query/queryClient';
import { track, AnalyticsEvent } from '~/shared/lib/analytics/track';
import { checkForOtaUpdate } from '~/shared/lib/updates/checkForOtaUpdate';
import { Theme } from '~/shared/theme/Theme';
import { setupPushNotifications } from '~/features/push-notifications/lib/setupPushNotifications';
import PushNotificationRoutingBridge from '~/features/push-notifications/ui/PushNotificationRoutingBridge';
import { fetchRexScoreTiers } from '~/features/rex-score/api/rexScoreTiersApi';
import { REX_SCORE_TIERS_QUERY_KEY } from '~/shared/config/queryKeys';
import TierUpgradeCelebrationBridge from '~/features/rex-score/ui/TierUpgradeCelebrationBridge';

setupQueryNetwork();
setupPushNotifications();

export { AppErrorBoundary as ErrorBoundary };

function AuthBootGate() {
  const { booting } = useAuth();
  if (!booting) return null;
  return <BrandBootLoader />;
}

function BootstrapEffects() {
  useEffect(() => {
    track(AnalyticsEvent.AppOpened);
    void checkForOtaUpdate();
    void queryClient.prefetchQuery({
      queryKey: REX_SCORE_TIERS_QUERY_KEY,
      queryFn: fetchRexScoreTiers,
      staleTime: 24 * 60 * 60_000,
    });
  }, []);
  return null;
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: queryPersister,
          maxAge: 24 * 60 * 60_000,
          dehydrateOptions: {
            shouldDehydrateQuery: (query) => query.state.status === 'success',
          },
        }}
      >
        <SafeAreaProvider style={{ flex: 1, backgroundColor: Theme.colors.background }}>
          <AuthProvider>
            <BootstrapEffects />
            <PushNotificationRoutingBridge />
            <TierUpgradeCelebrationBridge />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { flex: 1, backgroundColor: Theme.colors.background },
                animation: 'none',
              }}
            >
              <Stack.Screen
                name="create"
                options={{
                  presentation: 'transparentModal',
                  animation: 'none',
                  contentStyle: { flex: 1, backgroundColor: 'transparent' },
                  gestureEnabled: false,
                }}
              />
              <Stack.Screen
                name="rex/[rexId]"
                options={{
                  presentation: 'transparentModal',
                  animation: 'none',
                  contentStyle: { flex: 1, backgroundColor: 'transparent' },
                }}
              />
            </Stack>
            <AuthBootGate />
            <AppToast />
          </AuthProvider>
        </SafeAreaProvider>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
