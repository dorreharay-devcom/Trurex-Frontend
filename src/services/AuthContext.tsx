import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { Auth } from './AuthService';

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
  isGuest: boolean;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  loading: true,
  isGuest: false,
  loginAsGuest: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    Auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) console.warn('[Auth]', error.message);
        setSession(session);
        setUser(session?.user ?? null);
        if (session) setIsGuest(false);
        setLoading(false);
      })
      .catch((e) => {
        console.warn('[Auth] getSession failed', e);
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = Auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) setIsGuest(false);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, isGuest, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
