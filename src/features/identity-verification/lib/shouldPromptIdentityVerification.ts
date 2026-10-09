import { Auth } from '~/shared/api/client';
import { ProfileApi } from '~/features/profile/api/profileApi';
import { readStoredIdentityVerificationPrompted } from '~/features/identity-verification/lib/identityVerificationPromptStorage';

export async function shouldPromptIdentityVerification(): Promise<boolean> {
  const alreadyPrompted = await readStoredIdentityVerificationPrompted();
  if (alreadyPrompted) return false;

  const { data } = await Auth.getUser();
  const userId = data.user?.id;
  if (!userId) return false;

  const profile = await ProfileApi.getCurrentUser(userId).catch(() => null);
  return profile ? !profile.verified : false;
}
