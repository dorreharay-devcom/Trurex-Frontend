import { useEffect } from 'react';
import { useAuth } from '~/features/auth/providers';

export function useEndAuthBoot() {
  const { mfaChecking, setMfaChecking } = useAuth();

  useEffect(() => {
    if (!mfaChecking) return;
    const frame = requestAnimationFrame(() => {
      setMfaChecking(false);
    });
    return () => cancelAnimationFrame(frame);
  }, [mfaChecking, setMfaChecking]);
}
