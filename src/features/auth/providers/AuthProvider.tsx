import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { AuthApi } from '~/shared/api/authApi';
import { Auth } from '~/shared/api/client';
import {
  registerAccountSuspendedHandler,
  registerUnauthorizedRequestHandler,
} from '~/shared/lib/errors/restriction';
import { clearMfaRequirementCache } from '~/features/auth/lib/mfa';
import { useAuthSession } from '~/features/auth/hooks/useAuthSession';
import { useMfaSessionGate } from '~/features/auth/hooks/useMfaSessionGate';
import type { AuthState } from '~/features/auth/types/authState';
import { useNotificationsRealtime } from '~/shared/hooks/useNotificationsRealtime';
import { usePushTokenRegistration } from '~/features/push-notifications/hooks/usePushTokenRegistration';
import { unregisterCurrentDevicePushToken } from '~/features/push-notifications/lib/unregisterCurrentDevicePushToken';
import { withTimeout } from '~/shared/lib/network/withTimeout';

const SIGN_OUT_PUSH_CLEANUP_TIMEOUT_MS = 5000;

const AuthContext = createContext<AuthState | null>(null);

function NotificationsRealtimeBridge() {
  const { user, mfaPending, booting } = useAuth();
  useNotificationsRealtime(!booting && !mfaPending ? user?.id : null);
  return null;
}

function PushTokenBridge() {
  const { user, mfaPending, booting } = useAuth();
  usePushTokenRegistration(!booting && !mfaPending ? user?.id : null);
  return null;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    mfaPending,
    setMfaPending,
    mfaChecking,
    setMfaChecking,
    clearMfaGate,
    hydrateMfaPending,
  } = useMfaSessionGate();

  const { session, loading } = useAuthSession({
    onSessionCleared: clearMfaGate,
    onSessionLoaded: hydrateMfaPending,
  });

  const signOut = useCallback(async () => {
    setMfaChecking(false);
    clearMfaRequirementCache();
    await withTimeout(
      unregisterCurrentDevicePushToken().catch(() => undefined),
      SIGN_OUT_PUSH_CLEANUP_TIMEOUT_MS,
      undefined,
    );
    await AuthApi.signOut();
    await setMfaPending(false);
  }, [setMfaChecking, setMfaPending]);

  const forceLocalSignOut = useCallback(async () => {
    setMfaChecking(false);
    clearMfaRequirementCache();
    await Auth.signOut({ scope: 'local' }).catch(() => {});
    await setMfaPending(false);
  }, [setMfaChecking, setMfaPending]);

  useEffect(() => registerAccountSuspendedHandler(signOut), [signOut]);

  useEffect(() => registerUnauthorizedRequestHandler(forceLocalSignOut), [forceLocalSignOut]);

  useEffect(() => {
    if (!mfaChecking) return;
    const timeout = setTimeout(() => setMfaChecking(false), 10_000);
    return () => clearTimeout(timeout);
  }, [mfaChecking, setMfaChecking]);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      mfaPending,
      setMfaPending,
      mfaChecking,
      setMfaChecking,
      booting: loading || mfaChecking,
      signOut,
    }),
    [session, loading, mfaPending, setMfaPending, mfaChecking, setMfaChecking, signOut],
  );

  return (
    <AuthContext.Provider value={value}>
      <NotificationsRealtimeBridge />
      <PushTokenBridge />
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthState {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
