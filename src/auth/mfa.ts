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
const MFA_CHECK_CACHE_MS = 5000;

let mfaCheckInFlight: Promise<MfaCheckResult> | null = null;
let lastMfaCheck:
  | {
      deviceFingerprint: string;
      checkedAt: number;
      result: MfaCheckResult;
    }
  | null = null;

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
  const now = Date.now();

  if (
    lastMfaCheck &&
    lastMfaCheck.deviceFingerprint === deviceFingerprint &&
    now - lastMfaCheck.checkedAt < MFA_CHECK_CACHE_MS
  ) {
    return lastMfaCheck.result;
  }

  if (mfaCheckInFlight) {
    return mfaCheckInFlight;
  }

  mfaCheckInFlight = (async () => {
    const result = await initiateMfa(deviceFingerprint);

    const checkResult = {
      required: result.required,
      expiresAt: result.expires_at ?? null,
    };

    lastMfaCheck = {
      deviceFingerprint,
      checkedAt: Date.now(),
      result: checkResult,
    };

    return checkResult;
  })();

  try {
    return await mfaCheckInFlight;
  } finally {
    mfaCheckInFlight = null;
  }
}

export function clearMfaRequirementCache(): void {
  mfaCheckInFlight = null;
  lastMfaCheck = null;
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
