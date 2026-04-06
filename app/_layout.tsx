import '../global.css';
import '~/i18n/config';
import { Stack } from 'expo-router';
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
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
