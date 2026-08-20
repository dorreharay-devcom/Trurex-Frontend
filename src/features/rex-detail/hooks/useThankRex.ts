import { useLayoutEffect, useRef, useState } from 'react';
import { thankRex } from '~/features/rex-detail/api/thankRexApi';
import { useAuth } from '~/features/auth/providers';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { toastError } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';
import { track, AnalyticsEvent } from '~/shared/lib/analytics/track';

type ThankGate = { id: string; busy: boolean };

export function useThankRex(rexId: string, initialThanked: boolean) {
  const { user } = useAuth();
  const [thanked, setThanked] = useState(initialThanked);
  const gate = useRef<ThankGate>({ id: rexId, busy: false });

  useLayoutEffect(() => {
    gate.current = { id: rexId, busy: false };
    setThanked(initialThanked);
  }, [rexId, initialThanked]);

  const sendThank = async () => {
    if (!user) {
      toastError('Sign in required', 'Please sign in to thank recommendations.');
      return;
    }
    if (thanked || gate.current.busy) return;
    if (!assertOnlineForMutation('Thank you')) return;
    gate.current.busy = true;

    const requestRexId = rexId;
    setThanked(true);

    try {
      await thankRex(requestRexId);
      track(AnalyticsEvent.RexThanked);
    } catch (e) {
      if (gate.current.id !== requestRexId) return;
      setThanked(false);
      if (didAccountFrozenMutationToast(e)) return;
      const detail = unknownErrorMessage(e, '').trim();
      toastError(detail || "Couldn't send thank you", 'Try again.');
    } finally {
      if (gate.current.id === requestRexId) {
        gate.current.busy = false;
      }
    }
  };

  return { thanked, sendThank };
}
