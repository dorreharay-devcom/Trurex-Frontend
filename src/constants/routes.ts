import type { Href } from 'expo-router';

export const Routes = {
  Main: '/(main)',
  Login: '/(auth)/login',
} as const satisfies Record<string, Href>;
