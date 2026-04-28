import '../global.css';
import '~/i18n/config';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '~/services/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ComponentProps } from 'react';
import Toast, { ErrorToast, InfoToast, SuccessToast } from 'react-native-toast-message';
import { useFonts } from 'expo-font';

type ToastRowProps = ComponentProps<typeof SuccessToast>;

const queryClient = new QueryClient();

const toastBase = { alignSelf: 'flex-end' as const, marginRight: 16, borderLeftColor: '#E9560C' };

const toastConfig = {
  success: (props: ToastRowProps) => <SuccessToast {...props} style={[toastBase, props.style]} />,
  error: (props: ComponentProps<typeof ErrorToast>) => (
    <ErrorToast {...props} style={[toastBase, props.style]} />
  ),
  info: (props: ComponentProps<typeof InfoToast>) => (
    <InfoToast {...props} style={[toastBase, props.style]} />
  ),
};

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
          <Toast config={toastConfig} />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
