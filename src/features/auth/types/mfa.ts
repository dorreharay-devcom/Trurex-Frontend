export type MfaInitiateResult = {
  required: boolean;
  expires_at?: string | null;
};

export type MfaVerifyResult = {
  success: boolean;
};

export type MfaCheckResult = {
  required: boolean;
  expiresAt: string | null;
};

export type MfaVerifyParams = {
  code: string;
  deviceFingerprint: string;
  trustDevice: boolean;
};
