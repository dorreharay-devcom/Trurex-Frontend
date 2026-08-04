import { Auth, Backend, unwrap } from '~/shared/api/client';
import type {
  AuthSessionData,
  SignInParams,
  SignInWithOAuthParams,
  SignUpParams,
} from '~/shared/types/auth';
import type { OAuthResponse, Session, User } from '@supabase/supabase-js';

export type {
  AuthSessionData,
  SignInParams,
  SignInWithOAuthParams,
  SignUpParams,
} from '~/shared/types/auth';

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
    const data = unwrap<{ session: Session | null }>(await Auth.getSession());
    return data.session;
  },

  getUser: async (): Promise<User | null> => {
    const data = unwrap<{ user: User | null }>(await Auth.getUser());
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

  signInWithOAuth: async (params: SignInWithOAuthParams): Promise<OAuthResponse['data']> => {
    return unwrap(
      await Auth.signInWithOAuth({
        provider: params.provider,
        options: {
          redirectTo: params.redirectTo,
          skipBrowserRedirect: params.skipBrowserRedirect,
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

  deleteAccount: async (): Promise<void> => {
    const { error } = await Backend.functions.invoke('delete-account');
    if (error) {
      console.error('Supabase Delete Account Error:', error);
      throw error;
    }
  },
};
