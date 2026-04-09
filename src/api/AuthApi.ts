import { Auth, unwrap } from '~/services/AuthService';
import type { Session, User, OAuthResponse } from '@supabase/supabase-js';

export interface SignUpParams {
  email: string;
  password: string;
  displayName?: string;
  redirectTo?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface AuthSessionData {
  user: User | null;
  session: Session | null;
}

export const AuthApi = {
  signUp: async (params: SignUpParams): Promise<AuthSessionData> => {
    return unwrap(
      await Auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          emailRedirectTo: params.redirectTo,
          data: {
            display_name: params.displayName,
          },
        },
      }),
    );
  },

  signIn: async (params: SignInParams): Promise<AuthSessionData> => {
    return unwrap(
      await Auth.signInWithPassword({
        email: params.email,
        password: params.password,
      }),
    );
  },

  signOut: async (): Promise<void> => {
    const { error } = await Auth.signOut();
    if (error) {
      console.error('Supabase Sign Out Error:', error);
      throw error;
    }
  },

  getSession: async (): Promise<Session | null> => {
    const data = unwrap(await Auth.getSession());
    return data.session;
  },

  getUser: async (): Promise<User | null> => {
    const data = unwrap(await Auth.getUser());
    return data.user;
  },

  resetPassword: async (email: string, redirectTo: string): Promise<void> => {
    const { error } = await Auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) {
      console.error('Supabase Reset Password Error:', error);
      throw error;
    }
  },

  signInWithOAuth: async (
    provider: 'google' | 'apple',
    redirectTo?: string,
  ): Promise<OAuthResponse['data']> => {
    return unwrap(
      await Auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      }),
    );
  },

  updatePassword: async (password: string): Promise<void> => {
    const { error } = await Auth.updateUser({ password });
    if (error) {
      console.error('Supabase Update Password Error:', error);
      throw error;
    }
  },
};
