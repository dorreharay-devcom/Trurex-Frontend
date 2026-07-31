import '../../global.css';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '~/features/auth/providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { AppToast } from '~/shared/ui/toast/AppToast';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    'HankenGrotesk-Light': require('@assets/fonts/HankenGrotesk-Light.ttf'),
    'HankenGrotesk-Regular': require('@assets/fonts/HankenGrotesk-Regular.ttf'),
    'HankenGrotesk-Medium': require('@assets/fonts/HankenGrotesk-Medium.ttf'),
    'HankenGrotesk-SemiBold': require('@assets/fonts/HankenGrotesk-SemiBold.ttf'),
    'HankenGrotesk-Bold': require('@assets/fonts/HankenGrotesk-Bold.ttf'),
    'HankenGrotesk-ExtraBold': require('@assets/fonts/HankenGrotesk-ExtraBold.ttf'),
  });

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider style={{ flex: 1 }}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false, contentStyle: { flex: 1 } }} />
          <AppToast />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
