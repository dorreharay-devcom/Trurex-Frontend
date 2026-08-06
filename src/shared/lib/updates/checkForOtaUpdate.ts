import { Platform } from 'react-native';
import * as Updates from 'expo-updates';

export async function checkForOtaUpdate(): Promise<void> {
  if (__DEV__ || Platform.OS === 'web' || !Updates.isEnabled) return;

  try {
    const result = await Updates.checkForUpdateAsync();
    if (!result.isAvailable) return;
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
  } catch {
    // Offline / Expo servers — leave current bundle running.
  }
}
