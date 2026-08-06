import { processLock } from '@supabase/auth-js';
import { createClient } from '@supabase/supabase-js';
import { AuthStorage } from '~/shared/lib/storage/authStorage';
import { isFatalAuthSessionErrorCode } from '~/shared/lib/errors/authSession';
import {
  terminateIfAccountSuspendedRpcError,
  terminateIfUnauthorizedRequestError,
  terminateSessionForUnauthorizedRequest,
  toastIfAccountFrozenMutationError,
} from '~/shared/lib/errors/restriction';
import { fetchWithTimeout } from '~/shared/api/fetchWithTimeout';
import { isWeb } from '~/shared/lib/ui/platform';
import '~/shared/api/urlPolyfill';

const BACKEND_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const BACKEND_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const supabaseFetch: typeof fetch = async (input, init) => {
  const response = await fetchWithTimeout(input, init);
  if (response.status === 401) {
    terminateSessionForUnauthorizedRequest();
  }
  return response;
};

const client = createClient(BACKEND_URL, BACKEND_KEY, {
  auth: {
    storage: AuthStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: isWeb,
    lock: processLock,
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
