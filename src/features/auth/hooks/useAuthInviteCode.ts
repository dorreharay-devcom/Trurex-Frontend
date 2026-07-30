import { useCallback, useRef, useState } from 'react';
import type { InviteCodeInputRef } from '~/features/auth/types';
import {
  AUTH_INVITE_CODE_ENABLED,
  getAuthInviteCodeValidationError,
  isAuthInviteCodeValid,
} from '~/features/auth/config/authInvite';

export function useAuthInviteCode() {
  const inputRef = useRef<InviteCodeInputRef>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();

  const onChange = useCallback((next: string) => {
    setValue(next);
    setError(undefined);
  }, []);

  const validate = useCallback(() => {
    const validationError = getAuthInviteCodeValidationError(value);
    if (validationError) {
      setError(validationError);
      inputRef.current?.focus();
      return false;
    }
    return isAuthInviteCodeValid(value);
  }, [value]);

  return {
    enabled: AUTH_INVITE_CODE_ENABLED,
    value,
    error,
    onChange,
    inputRef,
    validate,
  };
}

export type AuthInviteCodeFieldState = ReturnType<typeof useAuthInviteCode>;
