import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { StorageService } from '~/shared/lib/storage';
import { isFatalAuthSessionErrorCode } from '~/shared/api/auth/sessionErrors';
import {
  terminateIfAccountSuspendedRpcError,
  terminateIfUnauthorizedRequestError,
  toastIfAccountFrozenMutationError,
} from '~/utils/mutationRestrictionError';
import { terminateSessionForUnauthorizedRequest } from '~/utils/accountSuspension';
import { isWeb } from '~/utils';

const BACKEND_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const BACKEND_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabaseFetch: typeof fetch = async (input, init) => {
  const response = await fetch(input, init);
  if (response.status === 401) {
    terminateSessionForUnauthorizedRequest();
  }
  return response;
};

const client = createClient(BACKEND_URL, BACKEND_KEY, {
  auth: {
    storage: StorageService,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: isWeb,
  },
  global: {
    fetch: supabaseFetch,
  },
});

export const Auth = client.auth;
export const Backend = client;

export function unwrap<T>(response: { data: unknown; error: unknown }): T {
  if (response.error) {
    const err = response.error as { code?: unknown };
    console.error('Supabase Error:', err);
    if (isFatalAuthSessionErrorCode(err?.code)) {
      Auth.signOut().catch(() => {});
    }
    terminateIfUnauthorizedRequestError(response.error);
    terminateIfAccountSuspendedRpcError(response.error);
    toastIfAccountFrozenMutationError(response.error);
    throw response.error;
  }
  return response.data as T;
}
