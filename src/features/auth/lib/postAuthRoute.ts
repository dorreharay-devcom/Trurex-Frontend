import type { Href } from 'expo-router';
import { Routes } from '~/shared/config/routes';
import { fetchUserConfig } from '~/shared/api/userConfigApi';
import { requiresBusinessSignup } from '~/features/auth/lib/businessSignup';
import { consumeStoredBusinessSignupIntent } from '~/features/auth/lib/businessSignupIntentStorage';
import { TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM } from '~/shared/config/featureFlags';

async function shouldCompleteBusinessSignup(): Promise<boolean> {
  const intent = await consumeStoredBusinessSignupIntent();
  if (!intent || !TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM) return false;
  return requiresBusinessSignup(await fetchUserConfig().catch(() => null));
}

export async function resolvePostAuthRoute(): Promise<Href | null> {
  return (await shouldCompleteBusinessSignup()) ? Routes.BusinessSignup : null;
}
