import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isFatalAuthSessionErrorCode, isSameAuthSession } from '~/shared/lib/errors/authSession';
import { Auth } from '~/shared/api/client';

type Params = {
  onSessionCleared: () => void;
  onSessionLoaded: (hasSession: boolean) => Promise<void>;
};

export function useAuthSession({ onSessionCleared, onSessionLoaded }: Params) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const applySession = (next: Session | null) => {
      setSession((prev) => (isSameAuthSession(prev, next) ? prev : next));
    };

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

        applySession(data.session);
        await onSessionLoaded(Boolean(data.session));
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
      applySession(nextSession);
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
