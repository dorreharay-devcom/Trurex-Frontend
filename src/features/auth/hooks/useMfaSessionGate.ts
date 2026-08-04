import { useCallback, useState } from 'react';
import { readStoredMfaPending, writeStoredMfaPending } from '~/features/auth/lib/mfa';

export function useMfaSessionGate() {
  const [mfaPending, setMfaPendingState] = useState(false);
  const [mfaChecking, setMfaChecking] = useState(false);

  const setMfaPending = useCallback(async (pending: boolean) => {
    setMfaPendingState(pending);
    await writeStoredMfaPending(pending);
  }, []);

  const clearMfaGate = useCallback(() => {
    setMfaPendingState(false);
    setMfaChecking(false);
    writeStoredMfaPending(false).catch(() => {});
  }, []);

  const hydrateMfaPending = useCallback(async (hasSession: boolean) => {
    const storedMfaPending = await readStoredMfaPending();
    const pending = Boolean(hasSession && storedMfaPending);
    setMfaPendingState(pending);
    if (!hasSession && storedMfaPending) {
      writeStoredMfaPending(false).catch(() => {});
    }
  }, []);

  return {
    mfaPending,
    setMfaPending,
    mfaChecking,
    setMfaChecking,
    clearMfaGate,
    hydrateMfaPending,
  };
}
