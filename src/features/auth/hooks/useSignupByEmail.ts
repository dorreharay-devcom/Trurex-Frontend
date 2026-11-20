import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthApi } from '~/shared/api/authApi';
import { Routes } from '~/shared/config/routes';
import {
  getEmailValidationError,
  getPasswordValidationError,
  isFieldErrorsEmpty,
} from '~/features/auth/lib/credentials';
import {
  EMAIL_ALREADY_USED_MESSAGE,
  isExistingAccountSignUp,
  mapAuthError,
} from '~/features/auth/lib/errors';
import { getRedirectUrl } from '~/features/auth/lib/redirect';
import { useAuthInviteCode } from '~/features/auth/hooks/useAuthInviteCode';
import { persistTermsAcceptance } from '~/features/auth/lib/terms';
import type { OAuthProvider } from '~/features/auth/lib/oauth';
import { useOAuthSignIn } from '~/features/auth/hooks/useOAuthSignIn';
import { writeStoredBusinessSignupIntent } from '~/features/auth/lib/businessSignupIntentStorage';
import {
  SIGNUP_ACCOUNT_TYPE,
  SIGNUP_ACCOUNT_TYPE_CONFIG,
  parseSignupAccountType,
  type SignupAccountType,
} from '~/features/auth/config/signupAccountType';
import { TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM } from '~/shared/config/featureFlags';
import { firstRouteParam } from '~/shared/lib/navigation/routeIds';

type SignupErrors = {
  displayName?: string;
  email?: string;
  password?: string;
  general?: string;
};

export function useSignupByEmail() {
  const router = useRouter();
  const { signInWithOAuth, oauthPending } = useOAuthSignIn();
  const invite = useAuthInviteCode();
  const searchParams = useLocalSearchParams<{
    ref?: string | string[];
    account?: string | string[];
  }>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [referralCode, setReferralCode] = useState(() => firstRouteParam(searchParams.ref) ?? '');
  const [errors, setErrors] = useState<SignupErrors>({});
  const [loading, setLoading] = useState(false);

  const accountType = TEMPORARY_ENABLE_BUSINESS_PROFILE_CLAIM
    ? parseSignupAccountType(firstRouteParam(searchParams.account))
    : SIGNUP_ACCOUNT_TYPE.personal;
  const accountConfig = SIGNUP_ACCOUNT_TYPE_CONFIG[accountType];
  const isBusinessAccount = accountType === SIGNUP_ACCOUNT_TYPE.business;

  function validateForm(): boolean {
    const fieldErrors = {
      displayName: accountConfig.validateName(displayName),
      email: getEmailValidationError(email),
      password: getPasswordValidationError(password),
    };
    setErrors(fieldErrors);
    const inviteValid = invite.validate();
    return isFieldErrorsEmpty(fieldErrors) && inviteValid;
  }

  async function handleSignup() {
    if (!validateForm()) return;

    await persistTermsAcceptance();
    setLoading(true);
    setErrors({});

    try {
      await writeStoredBusinessSignupIntent(false);
      const result = await AuthApi.signUp({
        email,
        password,
        redirectTo: getRedirectUrl(),
        displayName,
        referralCode,
        isBusinessAccount,
      });
      if (isExistingAccountSignUp(result)) {
        setErrors({ email: EMAIL_ALREADY_USED_MESSAGE });
        return;
      }
      router.replace(Routes.Login);
    } catch (error: unknown) {
      mapAuthError(error, setErrors);
    } finally {
      setLoading(false);
    }
  }

  function handleOAuthSignup(provider: OAuthProvider) {
    if (!invite.validate()) return;
    void persistTermsAcceptance();
    signInWithOAuth(provider, { businessSignup: isBusinessAccount });
  }

  function selectAccountType(type: SignupAccountType) {
    if (type === accountType) return;
    router.setParams({ account: type });
    setErrors((e) => ({ ...e, displayName: undefined, general: undefined }));
  }

  return {
    invite,
    accountType,
    accountConfig,
    email,
    password,
    displayName,
    referralCode,
    errors,
    loading,
    oauthPending,
    busy: oauthPending || loading,
    onDisplayNameChange: (value: string) => {
      setDisplayName(value);
      setErrors((e) => ({ ...e, displayName: undefined, general: undefined }));
    },
    onEmailChange: (value: string) => {
      setEmail(value);
      setErrors((e) => ({ ...e, email: undefined, general: undefined }));
    },
    onPasswordChange: (value: string) => {
      setPassword(value);
      setErrors((e) => ({ ...e, password: undefined, general: undefined }));
    },
    onReferralCodeChange: setReferralCode,
    selectAccountType,
    handleOAuthSignup,
    handleSignup,
    goToLogin: () => router.replace(Routes.Login),
  };
}
