import { Auth } from '~/shared/api/client';
import { ProfileApi } from '~/features/profile/api/profileApi';
import { readStoredIdentityVerificationPrompted } from '~/features/identity-verification/lib/identityVerificationPromptStorage';
import { TEMPORARY_ENABLE_IDENTITY_VERIFICATION } from '~/shared/config/featureFlags';
import { isWeb } from '~/shared/lib/ui/platform';

export async function shouldPromptIdentityVerification(): Promise<boolean> {
  if (!TEMPORARY_ENABLE_IDENTITY_VERIFICATION) return false;
  if (isWeb) return false;

  const { data } = await Auth.getUser();
  const userId = data.user?.id;
  if (!userId) return false;

  const alreadyPrompted = await readStoredIdentityVerificationPrompted(userId);
  if (alreadyPrompted) return false;

  const profile = await ProfileApi.getCurrentUser(userId).catch(() => null);
  return profile ? !profile.verified : false;
}
