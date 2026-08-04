export const AuthErrorCode = {
  InvalidCredentials: 'invalid_credentials',
  EmailNotConfirmed: 'email_not_confirmed',
  UserNotFound: 'user_not_found',
  SignupDisabled: 'signup_disabled',
  UserAlreadyExists: 'user_already_exists',
  WeakPassword: 'weak_password',
  OverEmailSendRateLimit: 'over_email_send_rate_limit',
} as const;

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AuthErrorCode.InvalidCredentials]: 'Invalid email or password. Please try again.',
  [AuthErrorCode.EmailNotConfirmed]: 'Please verify your email before signing in.',
  [AuthErrorCode.UserNotFound]: 'No account found with this email.',
  [AuthErrorCode.SignupDisabled]: 'Sign up is currently disabled.',
  [AuthErrorCode.UserAlreadyExists]: 'An account with this email already exists.',
  [AuthErrorCode.WeakPassword]: 'Password is too weak. Please use a stronger password.',
  [AuthErrorCode.OverEmailSendRateLimit]: 'Too many requests. Please try again later.',
};

const INVALID_LOGIN_CREDENTIALS_MESSAGE = 'Invalid login credentials';
const FALLBACK_ERROR_MESSAGE = 'An unexpected error occurred.';

export function getErrorMessage(error: unknown): string {
  if (!error) return FALLBACK_ERROR_MESSAGE;
  if (typeof error === 'string') return error;

  const err = error as Record<string, unknown>;
  const errDetail = err?.error as Record<string, unknown> | undefined;

  const code = (err?.code as string) || (errDetail?.code as string);
  const message =
    (err?.message as string) ||
    (err?.error_description as string) ||
    (typeof err?.error === 'string' ? err.error : undefined);

  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];
  if (message === INVALID_LOGIN_CREDENTIALS_MESSAGE) {
    return AUTH_ERROR_MESSAGES[AuthErrorCode.InvalidCredentials];
  }
  return message || FALLBACK_ERROR_MESSAGE;
}

type AuthFieldErrors = {
  email?: string;
  password?: string;
  fullName?: string;
  general?: string;
};

export function mapAuthError(error: unknown, setErrors: (errors: AuthFieldErrors) => void): void {
  const message = getErrorMessage(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes('email') ||
    normalized.includes('already exists') ||
    normalized.includes('user not found')
  ) {
    setErrors({ email: message });
    return;
  }
  if (normalized.includes('password') || normalized.includes('credential')) {
    setErrors({ password: message });
    return;
  }
  if (normalized.includes('name')) {
    setErrors({ fullName: message });
    return;
  }
  setErrors({ general: message });
}
