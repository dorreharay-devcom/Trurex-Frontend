import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Auth } from './AuthService';
import { AuthApi } from '~/api/AuthApi';

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
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.warn('[Auth]', error.message);
          const code = (error as any).code;
          if (code === 'refresh_token_not_found' || code === 'bad_jwt') {
            Auth.signOut().catch(() => {});
          }
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      })
      .catch((e) => {
        console.warn('[Auth] getSession failed', e);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = Auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await AuthApi.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
