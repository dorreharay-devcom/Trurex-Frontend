import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { StorageService } from './StorageService';

const BACKEND_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const BACKEND_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  '';

const client = createClient(BACKEND_URL, BACKEND_KEY, {
  auth: {
    storage: StorageService,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const Auth = client.auth;
export const Backend = client;

export function unwrap<T>(response: { data: unknown; error: unknown }): T {
  if (response.error) {
    console.error('Supabase Error:', response.error);
    throw response.error;
  }
  return response.data as T;
}
