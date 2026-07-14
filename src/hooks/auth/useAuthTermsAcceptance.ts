import { useCallback, useEffect, useState } from 'react';
import { LEGAL_TERMS_STORAGE_KEY, LEGAL_TERMS_VERSION } from '~/constants/legal';
import { StorageService } from '~/services/StorageService';

type StoredTermsAcceptance = {
  version: string;
  acceptedAt: string;
};

function parseStoredTerms(raw: string | null): StoredTermsAcceptance | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredTermsAcceptance;
    if (parsed?.version === LEGAL_TERMS_VERSION && parsed.acceptedAt) return parsed;
  } catch {
    return null;
  }
  return null;
}

export function useAuthTermsAcceptance() {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    StorageService.getItem(LEGAL_TERMS_STORAGE_KEY)
      .then((raw) => {
        if (!active) return;
        if (parseStoredTerms(raw)) setAccepted(true);
      })
      .finally(() => {
        if (active) setHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const onChange = useCallback((next: boolean) => {
    setAccepted(next);
    if (next) setError(undefined);
  }, []);

  const getValidationError = useCallback(() => {
    if (accepted) return undefined;
    return 'Accept the Terms and Guidelines to continue';
  }, [accepted]);

  const validate = useCallback(() => {
    const validationError = getValidationError();
    if (validationError) {
      setError(validationError);
      return false;
    }
    return true;
  }, [getValidationError]);

  const persistAcceptance = useCallback(async () => {
    const payload: StoredTermsAcceptance = {
      version: LEGAL_TERMS_VERSION,
      acceptedAt: new Date().toISOString(),
    };
    await StorageService.setItem(LEGAL_TERMS_STORAGE_KEY, JSON.stringify(payload));
  }, []);

  return {
    accepted,
    error,
    hydrated,
    onChange,
    getValidationError,
    validate,
    persistAcceptance,
    setError,
  };
}

export type AuthTermsAcceptanceState = ReturnType<typeof useAuthTermsAcceptance>;
