import {
  readPasswordRecoveryFromLocation,
  readRecoveryLinkErrorFromLocation,
  type RecoveryLinkError,
} from '~/features/auth/lib/password';

export const passwordRecoveryFromInitialUrl = readPasswordRecoveryFromLocation();
export const recoveryLinkErrorFromInitialUrl = readRecoveryLinkErrorFromLocation();
export const initialUrlHadPasswordRecoveryToken = passwordRecoveryFromInitialUrl;

export function getCurrentRecoveryLinkError(): RecoveryLinkError | null {
  return recoveryLinkErrorFromInitialUrl ?? readRecoveryLinkErrorFromLocation();
}
