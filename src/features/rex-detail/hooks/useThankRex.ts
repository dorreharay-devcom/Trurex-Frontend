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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const gate = useRef<ThankGate>({ id: rexId, busy: false });

  useLayoutEffect(() => {
    gate.current = { id: rexId, busy: false };
    setThanked(initialThanked);
    setSheetOpen(false);
    setSentMessage(null);
  }, [rexId, initialThanked]);

  const openSheet = () => {
    if (!user) {
      toastError('Sign in required', 'Please sign in to thank recommendations.');
      return;
    }
    if (thanked || gate.current.busy) return;
    if (!assertOnlineForMutation('Thank you')) return;
    setSheetOpen(true);
  };

  const closeSheet = () => setSheetOpen(false);
  const closeSuccess = () => setSentMessage(null);

  const sendThank = async (message?: string) => {
    if (thanked || gate.current.busy) return;
    gate.current.busy = true;

    const requestRexId = rexId;
    const previousThanked = thanked;
    setThanked(true);
    setSheetOpen(false);
    setSentMessage(message?.trim() || null);

    try {
      await thankRex(requestRexId, message);
      track(AnalyticsEvent.RexThanked);
    } catch (e) {
      if (gate.current.id !== requestRexId) return;
      setThanked(previousThanked);
      setSentMessage(null);
      if (didAccountFrozenMutationToast(e)) return;
      const detail = unknownErrorMessage(e, '').trim();
      toastError(detail || "Couldn't send thank you", 'Try again.');
    } finally {
      if (gate.current.id === requestRexId) {
        gate.current.busy = false;
      }
    }
  };

  return { thanked, sheetOpen, openSheet, closeSheet, sendThank, sentMessage, closeSuccess };
}
