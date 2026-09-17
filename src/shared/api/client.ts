import { AppState } from 'react-native';
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
import '~/features/auth/lib/passwordRecoverySnapshot';

const BACKEND_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const BACKEND_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const AUTH_API_TIMEOUT_MS = 8000;

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

const supabaseFetch: typeof fetch = async (input, init) => {
  const timeoutMs = requestUrl(input).includes('/auth/v1/') ? AUTH_API_TIMEOUT_MS : undefined;
  const response = await fetchWithTimeout(input, init, timeoutMs);
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

const AUTO_REFRESH_ACTIVE_DEBOUNCE_MS = 500;

let autoRefreshSetup = false;

export function setupAuthAutoRefresh(): void {
  if (isWeb || autoRefreshSetup) return;
  autoRefreshSetup = true;
  let activeTimer: ReturnType<typeof setTimeout> | undefined;
  AppState.addEventListener('change', (state) => {
    clearTimeout(activeTimer);
    activeTimer = undefined;
    if (state !== 'active') {
      Auth.stopAutoRefresh();
      return;
    }
    activeTimer = setTimeout(() => {
      activeTimer = undefined;
      Auth.startAutoRefresh();
    }, AUTO_REFRESH_ACTIVE_DEBOUNCE_MS);
  });
}

export function unwrap<T>(response: { data: unknown; error: unknown }): T {
  if (response.error) {
    const err = response.error as { code?: unknown };
    if (isFatalAuthSessionErrorCode(err?.code)) {
      Auth.signOut({ scope: 'local' }).catch(() => {});
    }
    terminateIfUnauthorizedRequestError(response.error);
    terminateIfAccountSuspendedRpcError(response.error);
    toastIfAccountFrozenMutationError(response.error);
    throw response.error;
  }
  return response.data as T;
}
