import type { Session, User } from '@supabase/supabase-js';

export type SignUpParams = {
  email: string;
  password: string;
  displayName?: string;
  redirectTo?: string;
};

export type SignInParams = {
  email: string;
  password: string;
};

export type AuthSessionData = {
  user: User | null;
  session: Session | null;
};

export type SignInWithOAuthParams = {
  provider: 'google' | 'apple';
  redirectTo: string;
  skipBrowserRedirect?: boolean;
};
