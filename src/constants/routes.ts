import type { Href } from 'expo-router';

export const Routes = {
  Main: '/(main)',
  Login: '/(auth)/login',
  Signup: '/(auth)/signup',
  ForgotPassword: '/(auth)/forgot-password',
  ResetPassword: '/(auth)/reset-password',
} as const satisfies Record<string, Href>;
