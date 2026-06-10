import type { Href } from 'expo-router';

export const Routes = {
  Main: '/',
  Login: '/login',
  Signup: '/signup',
  ForgotPassword: '/forgot-password',
  ResetPassword: '/reset-password',
  Mfa: '/mfa',
} as const satisfies Record<string, Href>;
