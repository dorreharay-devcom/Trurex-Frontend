import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthApi } from '~/shared/api/authApi';
import { USER_CONFIG_QUERY_KEY_ROOT, MY_PROFILES_QUERY_KEY_ROOT } from '~/shared/config/queryKeys';
import { toastError } from '~/shared/lib/appToast';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { useAuth } from '~/features/auth/providers/AuthProvider';
import { useContinueAfterAuth } from '~/features/auth/hooks/useContinueAfterAuth';
import { setBusinessAccount } from '~/features/auth/api/businessSignupApi';
import {
  isBusinessSignupIneligibleError,
  isBusinessSignupInvalidNameError,
} from '~/features/auth/lib/businessSignup';
import { EMAIL_ALREADY_USED_MESSAGE } from '~/features/auth/lib/errors';
import {
  SIGNUP_ACCOUNT_TYPE,
  SIGNUP_ACCOUNT_TYPE_CONFIG,
  signupHref,
} from '~/features/auth/config/signupAccountType';

type BusinessSignupErrors = {
  businessName?: string;
  general?: string;
};

type Pending = 'idle' | 'submit' | 'signOut';

const accountConfig = SIGNUP_ACCOUNT_TYPE_CONFIG[SIGNUP_ACCOUNT_TYPE.business];

export function useBusinessSignupCompletion() {
  const queryClient = useQueryClient();
  const { session, signOut } = useAuth();
  const continueAfterAuth = useContinueAfterAuth();

  const [businessName, setBusinessName] = useState('');
  const [errors, setErrors] = useState<BusinessSignupErrors>({});
  const [pending, setPending] = useState<Pending>('idle');

  const redirectTo = session ? null : signupHref(SIGNUP_ACCOUNT_TYPE.business);

  async function handleSubmitFailure(error: unknown) {
    if (isBusinessSignupIneligibleError(error)) {
      toastError(EMAIL_ALREADY_USED_MESSAGE);
      await signOut().catch(() => undefined);
      return;
    }
    if (isBusinessSignupInvalidNameError(error)) {
      setErrors({ businessName: unknownErrorMessage(error, 'Enter a valid business name') });
      return;
    }
    setErrors({
      general: unknownErrorMessage(
        error,
        'Could not set up your business account. Please try again.',
      ),
    });
  }

  async function handleSubmit() {
    const businessNameError = accountConfig.validateName(businessName);
    if (businessNameError) {
      setErrors({ businessName: businessNameError });
      return;
    }

    setPending('submit');
    setErrors({});

    try {
      await setBusinessAccount(businessName.trim());
      await AuthApi.refreshSession().catch(() => undefined);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: USER_CONFIG_QUERY_KEY_ROOT }),
        queryClient.invalidateQueries({ queryKey: MY_PROFILES_QUERY_KEY_ROOT }),
      ]);
      await continueAfterAuth();
    } catch (error: unknown) {
      await handleSubmitFailure(error);
    } finally {
      setPending('idle');
    }
  }

  async function handleSignOut() {
    setPending('signOut');
    setErrors({});
    try {
      await signOut();
    } catch (error: unknown) {
      setErrors({ general: unknownErrorMessage(error, 'Could not sign out. Please try again.') });
    } finally {
      setPending('idle');
    }
  }

  return {
    redirectTo,
    accountConfig,
    businessName,
    errors,
    submitting: pending === 'submit',
    busy: pending !== 'idle',
    onBusinessNameChange: (value: string) => {
      setBusinessName(value);
      setErrors((e) => ({ ...e, businessName: undefined, general: undefined }));
    },
    handleSubmit,
    handleSignOut,
  };
}
