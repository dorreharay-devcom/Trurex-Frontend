import { Backend, unwrap } from '~/services/AuthService';
import { getDeviceFingerprint } from './deviceFingerprint';

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

const MFA_CODE_PATTERN = /\bMFA0[1-4]\b/;

export { getDeviceFingerprint };

export async function initiateMfa(deviceFingerprint: string): Promise<MfaInitiateResult> {
  const data = unwrap<MfaInitiateResult>(
    await Backend.rpc('initiate_mfa', {
      p_device_fingerprint: deviceFingerprint,
    }),
  );

  return {
    required: Boolean(data.required),
    expires_at: data.expires_at ?? null,
  };
}

export async function verifyMfaCode(params: MfaVerifyParams): Promise<MfaVerifyResult> {
  return unwrap<MfaVerifyResult>(
    await Backend.rpc('verify_mfa_code', {
      p_code: params.code,
      p_device_fingerprint: params.deviceFingerprint,
      p_trust_device: params.trustDevice,
    }),
  );
}

export async function checkMfaRequirement(): Promise<MfaCheckResult> {
  const deviceFingerprint = await getDeviceFingerprint();
  const result = await initiateMfa(deviceFingerprint);

  return {
    required: result.required,
    expiresAt: result.expires_at ?? null,
  };
}

export function getMfaErrorCode(error: unknown): string | null {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string' && MFA_CODE_PATTERN.test(code)) return code;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') {
      return message.match(MFA_CODE_PATTERN)?.[0] ?? null;
    }
  }

  if (error instanceof Error) {
    return error.message.match(MFA_CODE_PATTERN)?.[0] ?? null;
  }

  return null;
}
