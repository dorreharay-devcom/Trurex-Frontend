import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricUnlockResult = 'not_applicable' | 'success' | 'failed';

export async function attemptBiometricUnlock(): Promise<BiometricUnlockResult> {
  const [hasHardware, isEnrolled] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
  ]);

  if (!hasHardware || !isEnrolled) return 'not_applicable';

  try {
    const result = await LocalAuthentication.authenticateAsync();
    return result.success ? 'success' : 'failed';
  } catch {
    return 'failed';
  }
}
