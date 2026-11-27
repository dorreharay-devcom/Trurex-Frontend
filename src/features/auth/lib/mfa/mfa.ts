import { Backend, unwrap } from '~/shared/api/client';
import { getDeviceFingerprint } from './deviceFingerprint';
import type {
  MfaCheckResult,
  MfaInitiateResult,
  MfaVerifyParams,
  MfaVerifyResult,
} from '~/features/auth/types/mfa';

export type {
  MfaCheckResult,
  MfaInitiateResult,
  MfaVerifyParams,
  MfaVerifyResult,
} from '~/features/auth/types/mfa';

export const MfaErrorCode = {
  RestartGeneric: 'MFA01',
  CodeExpired: 'MFA02',
  TooManyAttempts: 'MFA03',
  InvalidCode: 'MFA04',
} as const;

export type MfaErrorCodeId = (typeof MfaErrorCode)[keyof typeof MfaErrorCode];

export const MFA_ERROR_CODES: MfaErrorCodeId[] = Object.values(MfaErrorCode);

export const MfaMessage = {
  invalidCode: 'Invalid code. Please check the email and try again.',
  enterCode: 'Enter the 6-digit verification code.',
  verifyFailed: 'Verification failed. Please try again.',
  resendFailed: 'Could not send a new verification code. Please try again.',
  resendSuccess: 'We sent a new verification code.',
} as const;
export const MFA_RESTART_NOTICES: Partial<Record<MfaErrorCodeId, string>> = {
  [MfaErrorCode.RestartGeneric]: 'We sent a new verification code. Please try again.',
  [MfaErrorCode.CodeExpired]: 'That code expired. We sent a new verification code.',
  [MfaErrorCode.TooManyAttempts]: 'Too many attempts. We sent a new verification code.',
};

const MFA_CODE_IN_MESSAGE = new RegExp(`\\b(${MFA_ERROR_CODES.join('|')})\\b`);
const MFA_CHECK_CACHE_MS = 5000;

export function isMfaErrorCode(value: string): value is MfaErrorCodeId {
  return (MFA_ERROR_CODES as string[]).includes(value);
}

function readStringField(error: unknown, field: string): string | null {
  if (typeof error !== 'object' || error === null || !(field in error)) return null;
  const value = (error as Record<string, unknown>)[field];
  return typeof value === 'string' ? value : null;
}

function mfaCodeFromText(text: string | null): MfaErrorCodeId | null {
  const match = text?.match(MFA_CODE_IN_MESSAGE)?.[1];
  return match && isMfaErrorCode(match) ? match : null;
}

export function getMfaErrorCode(error: unknown): MfaErrorCodeId | null {
  const explicitCode = readStringField(error, 'code');
  if (explicitCode && isMfaErrorCode(explicitCode)) return explicitCode;

  const fromMessage = mfaCodeFromText(readStringField(error, 'message'));
  if (fromMessage) return fromMessage;

  return error instanceof Error ? mfaCodeFromText(error.message) : null;
}

type CachedCheck = {
  deviceFingerprint: string;
  checkedAt: number;
  result: MfaCheckResult;
};

type MfaRequirementCache = {
  peek: (deviceFingerprint: string, now?: number) => MfaCheckResult | null;
  load: (
    deviceFingerprint: string,
    fetchCheck: () => Promise<MfaCheckResult>,
  ) => Promise<MfaCheckResult>;
  clear: () => void;
};

const createMfaRequirementCache = (): MfaRequirementCache => {
  const state = {
    inFlight: null as Promise<MfaCheckResult> | null,
    last: null as CachedCheck | null,
  };

  const peek = (deviceFingerprint: string, now = Date.now()): MfaCheckResult | null => {
    const last = state.last;
    if (!last) return null;
    if (last.deviceFingerprint !== deviceFingerprint) return null;
    if (now - last.checkedAt >= MFA_CHECK_CACHE_MS) return null;
    return last.result;
  };

  return {
    peek,

    load(deviceFingerprint, fetchCheck) {
      const cached = peek(deviceFingerprint);
      if (cached) return Promise.resolve(cached);
      if (state.inFlight) return state.inFlight;

      state.inFlight = fetchCheck()
        .then((result) => {
          state.last = { deviceFingerprint, checkedAt: Date.now(), result };
          return result;
        })
        .finally(() => {
          state.inFlight = null;
        });

      return state.inFlight;
    },

    clear() {
      state.inFlight = null;
      state.last = null;
    },
  };
};

const mfaRequirementCache = createMfaRequirementCache();

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

  return mfaRequirementCache.load(deviceFingerprint, async () => {
    const result = await initiateMfa(deviceFingerprint);
    return {
      required: result.required,
      expiresAt: result.expires_at ?? null,
    };
  });
}

export function clearMfaRequirementCache(): void {
  mfaRequirementCache.clear();
}
