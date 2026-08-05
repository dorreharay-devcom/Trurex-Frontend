import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { AuthApi } from '~/shared/api/authApi';
import { registerAccountSuspendedHandler } from '~/shared/lib/errors/restriction';
import { clearMfaRequirementCache } from '~/features/auth/lib/mfa';
import { useAuthSession } from '~/features/auth/hooks/useAuthSession';
import { useMfaSessionGate } from '~/features/auth/hooks/useMfaSessionGate';
import type { AuthState } from '~/features/auth/types/authState';

const AuthContext = createContext<AuthState | null>(null);

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
    await AuthApi.signOut();
    await setMfaPending(false);
  }, [setMfaChecking, setMfaPending]);

  useEffect(() => registerAccountSuspendedHandler(signOut), [signOut]);

  useEffect(() => {
    if (!mfaChecking) return;
    const timeout = setTimeout(() => setMfaChecking(false), 10_000);
    return () => clearTimeout(timeout);
  }, [mfaChecking, setMfaChecking]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        loading,
        mfaPending,
        setMfaPending,
        mfaChecking,
        setMfaChecking,
        booting: loading || mfaChecking,
        signOut,
      }}
    >
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
