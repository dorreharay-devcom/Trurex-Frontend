import type { Href } from 'expo-router';

export const Routes = {
  Main: '/',
  Login: '/login',
  Signup: '/signup',
  ForgotPassword: '/forgot-password',
  ResetPassword: '/reset-password',
  Mfa: '/mfa',
  Terms: '/terms',
  CommunityGuidelines: '/community-guidelines',
} as const satisfies Record<string, Href>;
