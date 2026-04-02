import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { StorageService } from './StorageService';

const BACKEND_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const BACKEND_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const client = createClient(BACKEND_URL, BACKEND_ANON_KEY, {
  auth: {
    storage: StorageService,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Global authentication service.
 * Usage: Auth.signInWithPassword(...), Auth.onAuthStateChange(...)
 */
export const Auth = client.auth;

/**
 * Global backend client for database, storage, etc.
 * Usage: Backend.from('table').select('*')
 */
export const Backend = client;
