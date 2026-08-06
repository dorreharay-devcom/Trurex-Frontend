import { ApiTimeoutError } from '~/shared/api/fetchWithTimeout';
import { isPlainObject, isNonEmptyString } from '~/shared/lib/data/guards';

const RATE_LIMIT_MESSAGE = 'Too many requests. Please try again later.';
const TIMEOUT_MESSAGE = 'Request timed out. Check your connection and try again.';

function errorCode(error: unknown): string | undefined {
  if (!isPlainObject(error)) return undefined;
  const code = error.code;
  return typeof code === 'string' ? code : undefined;
}

function errorMessage(error: unknown): string | undefined {
  if (error instanceof Error && isNonEmptyString(error.message)) return error.message;
  if (isPlainObject(error) && isNonEmptyString(error.message)) return error.message;
  return undefined;
}

function httpStatus(error: unknown): number | undefined {
  if (!isPlainObject(error)) return undefined;
  const status = error.status ?? error.statusCode;
  if (typeof status === 'number' && Number.isFinite(status)) return status;
  if (typeof status === 'string') {
    const n = Number(status);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

export function isRateLimitError(error: unknown): boolean {
  if (httpStatus(error) === 429) return true;
  const code = errorCode(error)?.toLowerCase() ?? '';
  if (code.includes('rate_limit') || code === 'over_request_rate_limit' || code === '429') {
    return true;
  }
  const message = (errorMessage(error) ?? '').toLowerCase();
  return (
    message.includes('rate limit') ||
    message.includes('too many requests') ||
    message.includes('over_email_send_rate_limit')
  );
}

export function isTimeoutError(error: unknown): boolean {
  if (error instanceof ApiTimeoutError) return true;
  if (errorCode(error) === 'TIMEOUT') return true;
  const message = (errorMessage(error) ?? '').toLowerCase();
  return message.includes('timed out') || message.includes('timeout');
}

export function userFacingNetworkErrorMessage(error: unknown, fallback: string): string {
  if (isTimeoutError(error)) return TIMEOUT_MESSAGE;
  if (isRateLimitError(error)) return RATE_LIMIT_MESSAGE;
  return errorMessage(error) ?? fallback;
}
