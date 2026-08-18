import { isWeb } from '~/shared/lib/ui/platform';

export type RecoveryLinkError = {
  code: string | null;
  description: string | null;
};

export const RecoveryLinkErrorCode = {
  OtpExpired: 'otp_expired',
} as const;

export const ResetPasswordMessage = {
  linkExpired: 'This password reset link is invalid or has expired.',
  linkUnusable: 'This password reset link cannot be used.',
  requestNewLink: 'Please request a new password reset link from the sign in page.',
  verifyFailed: 'Could not verify the reset link. Try again.',
  openLinkFirst: 'Open the reset link from your email before setting a new password.',
  updatedTitle: 'Password updated',
  updatedBody: 'You can now sign in with your new password.',
} as const;

function locationTokenSource(): string {
  if (!isWeb) return '';
  return `${window.location.search}${window.location.hash}`;
}

function parseLocationAuthParams(): URLSearchParams {
  if (!isWeb) return new URLSearchParams();
  return new URLSearchParams(
    `${window.location.search.replace(/^\?/, '')}&${window.location.hash.replace(/^#/, '')}`,
  );
}

export function readPasswordRecoveryFromLocation(): boolean {
  if (!isWeb) return false;
  const tokenSource = locationTokenSource();
  if (tokenSource.includes('type=recovery') || tokenSource.includes('type%3Drecovery')) {
    return true;
  }
  const onResetPath = window.location.pathname.includes('/reset-password');
  if (!onResetPath) return false;
  return (
    tokenSource.includes('access_token') ||
    tokenSource.includes('refresh_token') ||
    /[?&#]code=/.test(tokenSource)
  );
}

export function readRecoveryLinkErrorFromLocation(): RecoveryLinkError | null {
  if (!isWeb) return null;
  const params = parseLocationAuthParams();
  const error = params.get('error');
  if (!error) return null;
  return {
    code: params.get('error_code'),
    description: params.get('error_description'),
  };
}

export function currentUrlHasPasswordRecoveryToken(): boolean {
  return readPasswordRecoveryFromLocation();
}
