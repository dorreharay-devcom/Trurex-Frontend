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

/** Bottom-right: library container centers; alignSelf pulls each toast to the trailing edge. */
const toastTrailing = { alignSelf: 'flex-end' as const, marginRight: 16 };

const toastConfig = {
  success: (props: ToastRowProps) => (
    <SuccessToast {...props} style={[toastTrailing, props.style]} />
  ),
  error: (props: ComponentProps<typeof ErrorToast>) => (
    <ErrorToast {...props} style={[toastTrailing, props.style]} />
  ),
  info: (props: ComponentProps<typeof InfoToast>) => (
    <InfoToast {...props} style={[toastTrailing, props.style]} />
  ),
};

export default function RootLayout() {
  const [loaded] = useFonts({
    HankenGrotesk_300Light: require('../assets/fonts/HankenGrotesk-Light.ttf'),
    HankenGrotesk_400Regular: require('../assets/fonts/HankenGrotesk-Regular.ttf'),
    HankenGrotesk_500Medium: require('../assets/fonts/HankenGrotesk-Medium.ttf'),
    HankenGrotesk_600SemiBold: require('../assets/fonts/HankenGrotesk-SemiBold.ttf'),
    HankenGrotesk_700Bold: require('../assets/fonts/HankenGrotesk-Bold.ttf'),
    HankenGrotesk_800ExtraBold: require('../assets/fonts/HankenGrotesk-ExtraBold.ttf'),
  });

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
