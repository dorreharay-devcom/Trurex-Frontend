import { useNavigation, useRouter } from 'expo-router';
import { Routes } from '~/shared/config/routes';
import { isWeb } from '~/shared/lib/ui/platform';

export function useLeaveLegalDocument() {
  const router = useRouter();
  const navigation = useNavigation();

  return () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    if (isWeb) {
      window.history.back();
      return;
    }
    router.replace(Routes.Login);
  };
}
