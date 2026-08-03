export { default as OAuthSocialButtons } from './ui/oauth/OAuthSocialButtons';
export { default as InviteCodeInput } from './ui/fields/InviteCodeInput';
export { default as AuthTermsAcceptanceField } from './ui/fields/AuthTermsAcceptanceField';
export { default as AuthLayout } from './ui/common/AuthLayout';
export { default as AuthBrandHeader } from './ui/common/AuthBrandHeader';
export { default as AuthOrDivider } from './ui/common/AuthOrDivider';
export { default as AuthSwitchLink } from './ui/common/AuthSwitchLink';
export { default as ForgotPasswordLink } from './ui/fields/ForgotPasswordLink';
export { default as AuthTrustDeviceField } from './ui/fields/AuthTrustDeviceField';
export { default as GoogleGMark } from './ui/oauth/GoogleGMark';
export { default as AppleLogoMark } from './ui/oauth/AppleLogoMark';
export { default as ResetPasswordExpiredState } from './ui/password/ResetPasswordExpiredState';
export { default as LegalDocumentScreen } from './ui/legal/LegalDocumentScreen';

export { AuthProvider, useAuth } from './providers';

export { useUserConfig } from './hooks/useUserConfig';
export { useAuthInviteCode } from './hooks/useAuthInviteCode';
export type { AuthInviteCodeFieldState } from './hooks/useAuthInviteCode';
export { useOAuthSignIn } from './hooks/useOAuthSignIn';
export { useLoginByEmail } from './hooks/useLoginByEmail';
export { useSignupByEmail } from './hooks/useSignupByEmail';
export { useForgotPassword } from './hooks/useForgotPassword';
export { useResetPassword } from './hooks/useResetPassword';
export { useMfaVerification } from './hooks/useMfaVerification';
export { useLeaveLegalDocument } from './hooks/useLeaveLegalDocument';

export type { OAuthProvider, InviteCodeInputRef, AuthState } from './types';
export { AuthEvent } from './types';
export type { AuthEventName } from './types';
export { signInWithOAuthProvider, completeOAuthSessionFromUrl } from './lib/oauth';
export { navigateAfterAuthenticatedSession } from './lib/mfa';
export { persistTermsAcceptance } from './lib/terms';
export {
  getEmailValidationError,
  getPasswordValidationError,
  getFullNameValidationError,
  getConfirmPasswordValidationError,
  isFieldErrorsEmpty,
} from './lib/credentials';
export { getErrorMessage, mapAuthError } from './lib/errors';
export {
  getMfaErrorCode,
  initiateMfa,
  verifyMfaCode,
  checkMfaRequirement,
  clearMfaRequirementCache,
  MfaErrorCode,
  MfaMessage,
  MFA_RESTART_NOTICES,
  MFA_ERROR_CODES,
  isMfaErrorCode,
} from './lib/mfa';
export type { MfaErrorCodeId } from './lib/mfa';
export { getDeviceFingerprint } from './lib/mfa';
export type {
  MfaCheckResult,
  MfaInitiateResult,
  MfaVerifyParams,
  MfaVerifyResult,
} from './types/mfa';

export {
  AUTH_INVITE_CODE_ENABLED,
  AUTH_INVITE_CODE,
  AUTH_INVITE_CODE_LENGTH,
  normalizeInviteCode,
  isAuthInviteCodeValid,
  getAuthInviteCodeValidationError,
} from './config/authInvite';
export { TERMS_OF_USE, PRIVACY_POLICY, COMMUNITY_GUIDELINES } from './config/legalDocuments';
export type { LegalDocumentContent, LegalSection } from './config/legalDocuments';
export {
  currentUrlHasPasswordRecoveryToken,
  initialUrlHadPasswordRecoveryToken,
  getCurrentRecoveryLinkError,
  RecoveryLinkErrorCode,
  ResetPasswordMessage,
} from './lib/password';
export type { RecoveryLinkError } from './lib/password';
