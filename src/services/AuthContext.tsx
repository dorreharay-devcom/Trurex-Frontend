import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Auth } from './AuthService';
import { AuthApi } from '~/api/AuthApi';
import { StorageService } from './StorageService';
import { registerAccountSuspendedHandler } from '~/utils/accountSuspension';

export enum AuthEvent {
  PasswordRecovery = 'PASSWORD_RECOVERY',
  SignedOut = 'SIGNED_OUT',
  SignedIn = 'SIGNED_IN',
  TokenRefreshed = 'TOKEN_REFRESHED',
  UserUpdated = 'USER_UPDATED',
}

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  mfaPending: boolean;
  setMfaPending: (pending: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
  mfaPending: false,
  setMfaPending: async () => {},
  signOut: async () => {},
});

const MFA_PENDING_STORAGE_KEY = 'trurex.mfa.pending';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mfaPending, setMfaPendingState] = useState(false);

  useEffect(() => {
    Promise.all([Auth.getSession(), StorageService.getItem(MFA_PENDING_STORAGE_KEY)])
      .then(
        ([
          {
            data: { session },
            error,
          },
          storedMfaPending,
        ]) => {
          if (error) {
            console.warn('[Auth]', error.message);
            const code = (error as { code?: unknown }).code;
            if (code === 'refresh_token_not_found' || code === 'bad_jwt') {
              Auth.signOut().catch(() => {});
            }
          }
          setSession(session);
          setUser(session?.user ?? null);
          setMfaPendingState(Boolean(session && storedMfaPending === 'true'));
          if (!session && storedMfaPending === 'true') {
            StorageService.removeItem(MFA_PENDING_STORAGE_KEY).catch(() => {});
          }
          setLoading(false);
        },
      )
      .catch((e) => {
        console.warn('[Auth] getSession failed', e);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = Auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setMfaPendingState(false);
        StorageService.removeItem(MFA_PENDING_STORAGE_KEY).catch(() => {});
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setMfaPending = useCallback(async (pending: boolean) => {
    setMfaPendingState(pending);
    if (pending) {
      await StorageService.setItem(MFA_PENDING_STORAGE_KEY, 'true');
      return;
    }
    await StorageService.removeItem(MFA_PENDING_STORAGE_KEY);
  }, []);

  const signOut = useCallback(async () => {
    await setMfaPending(false);
    await AuthApi.signOut();
  }, [setMfaPending]);

  useEffect(() => registerAccountSuspendedHandler(signOut), [signOut]);

  return (
    <AuthContext.Provider value={{ session, user, loading, mfaPending, setMfaPending, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
