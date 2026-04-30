import '../global.css';
import '~/i18n/config';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '~/services/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { AppToast } from '~/components/toast/AppToast';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded] = useFonts({
    'HankenGrotesk-Light': require('../assets/fonts/HankenGrotesk-Light.ttf'),
    'HankenGrotesk-Regular': require('../assets/fonts/HankenGrotesk-Regular.ttf'),
    'HankenGrotesk-Medium': require('../assets/fonts/HankenGrotesk-Medium.ttf'),
    'HankenGrotesk-SemiBold': require('../assets/fonts/HankenGrotesk-SemiBold.ttf'),
    'HankenGrotesk-Bold': require('../assets/fonts/HankenGrotesk-Bold.ttf'),
    'HankenGrotesk-ExtraBold': require('../assets/fonts/HankenGrotesk-ExtraBold.ttf'),
  });

  console.log('loaded', loaded);

  if (!loaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <AppToast />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
