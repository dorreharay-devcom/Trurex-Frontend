import { Auth } from '~/shared/api/client';
import { ProfileApi } from '~/features/profile/api/profileApi';
import { readStoredIdentityVerificationPrompted } from '~/features/identity-verification/lib/identityVerificationPromptStorage';
import { isWeb } from '~/shared/lib/ui/platform';

export async function shouldPromptIdentityVerification(): Promise<boolean> {
  if (isWeb) return false;

  const alreadyPrompted = await readStoredIdentityVerificationPrompted();
  if (alreadyPrompted) return false;

  const { data } = await Auth.getUser();
  const userId = data.user?.id;
  if (!userId) return false;

  const profile = await ProfileApi.getCurrentUser(userId).catch(() => null);
  return profile ? !profile.verified : false;
}
