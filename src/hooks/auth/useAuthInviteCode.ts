import { useCallback, useRef, useState } from 'react';
import type { InviteCodeInputRef } from '~/components/auth/InviteCodeInput';
import {
  AUTH_INVITE_CODE_ENABLED,
  getAuthInviteCodeValidationError,
  isAuthInviteCodeValid,
} from '~/constants/authInvite';

export function useAuthInviteCode() {
  const inputRef = useRef<InviteCodeInputRef>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();

  const onChange = useCallback((next: string) => {
    setValue(next);
    setError(undefined);
  }, []);

  const getValidationError = useCallback(
    () => getAuthInviteCodeValidationError(value),
    [value],
  );

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
    getValidationError,
    validate,
    setError,
  };
}

export type AuthInviteCodeFieldState = ReturnType<typeof useAuthInviteCode>;
