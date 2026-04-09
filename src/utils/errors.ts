export const getErrorMessage = (error: unknown): string => {
  if (!error) return 'An unexpected error occurred.';
  if (typeof error === 'string') return error;

  const err = error as Record<string, unknown>;
  const errDetail = err?.error as Record<string, unknown> | undefined;

  const code = (err?.code as string) || (errDetail?.code as string);
  const message =
    (err?.message as string) ||
    (err?.error_description as string) ||
    (typeof err?.error === 'string' ? err.error : undefined);

  switch (code) {
    case 'invalid_credentials':
      return 'Invalid email or password. Please try again.';
    case 'email_not_confirmed':
      return 'Please verify your email before signing in.';
    case 'user_not_found':
      return 'No account found with this email.';
    case 'signup_disabled':
      return 'Sign up is currently disabled.';
    case 'user_already_exists':
      return 'An account with this email already exists.';
    case 'weak_password':
      return 'Password is too weak. Please use a stronger password.';
    case 'over_email_send_rate_limit':
      return 'Too many requests. Please try again later.';
    default:
      if (message === 'Invalid login credentials') {
        return 'Invalid email or password. Please try again.';
      }
      return message || 'An unexpected error occurred.';
  }
};

export const mapAuthError = (
  error: unknown,
  setErrors: (errors: {
    email?: string;
    password?: string;
    fullName?: string;
    general?: string;
  }) => void,
) => {
  const message = getErrorMessage(error);
  const normalized = message.toLowerCase();

  if (
    normalized.includes('email') ||
    normalized.includes('already exists') ||
    normalized.includes('user not found')
  ) {
    setErrors({ email: message });
  } else if (normalized.includes('password') || normalized.includes('credential')) {
    setErrors({ password: message });
  } else if (normalized.includes('name')) {
    setErrors({ fullName: message });
  } else {
    setErrors({ general: message });
  }
};
