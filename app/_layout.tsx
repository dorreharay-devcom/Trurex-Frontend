import '../global.css';
import '~/i18n/config';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '~/services/AuthContext';
import { useFonts } from 'expo-font';
import {
  HankenGrotesk_300Light,
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
} from '@expo-google-fonts/hanken-grotesk';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ComponentProps } from 'react';
import Toast, { ErrorToast, InfoToast, SuccessToast } from 'react-native-toast-message';

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
    HankenGrotesk_300Light,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    HankenGrotesk_800ExtraBold,
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
