import '../global.css';
import '~/i18n/config';
import { Stack } from 'expo-router';
import { AuthProvider } from '~/services/AuthContext';

/**
 * Root Layout component that provides AuthContext to the entire app.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
