import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Auth } from '~/shared/api/client';
import { isFatalAuthSessionErrorCode } from '~/shared/api/auth/sessionErrors';

type Params = {
  onSessionCleared: () => void;
  onSessionLoaded: (hasSession: boolean) => Promise<void>;
};

export function useAuthSession({ onSessionCleared, onSessionLoaded }: Params) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const { data, error } = await Auth.getSession();
        if (!active) return;

        if (error) {
          console.warn('[Auth]', error.message);
          if (isFatalAuthSessionErrorCode((error as { code?: unknown }).code)) {
            Auth.signOut().catch(() => {});
          }
        }

        const nextSession = data.session;
        setSession(nextSession);
        await onSessionLoaded(Boolean(nextSession));
      } catch (error) {
        console.warn('[Auth] getSession failed', error);
      } finally {
        if (active) setLoading(false);
      }
    }

    bootstrap();

    const {
      data: { subscription },
    } = Auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) onSessionCleared();
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [onSessionCleared, onSessionLoaded]);

  return { session, loading };
}
