export const AuthEvent = {
  PasswordRecovery: 'PASSWORD_RECOVERY',
  SignedOut: 'SIGNED_OUT',
  SignedIn: 'SIGNED_IN',
  TokenRefreshed: 'TOKEN_REFRESHED',
  UserUpdated: 'USER_UPDATED',
} as const;

export type AuthEventName = (typeof AuthEvent)[keyof typeof AuthEvent];
