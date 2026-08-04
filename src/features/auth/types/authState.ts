import type { Session, User } from '@supabase/supabase-js';

export type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  mfaPending: boolean;
  setMfaPending: (pending: boolean) => Promise<void>;
  mfaChecking: boolean;
  setMfaChecking: (checking: boolean) => void;
  booting: boolean;
  signOut: () => Promise<void>;
};
