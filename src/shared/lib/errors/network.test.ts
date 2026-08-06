import { describe, expect, it } from 'vitest';
import { ApiTimeoutError } from '~/shared/api/fetchWithTimeout';
import {
  isRateLimitError,
  isTimeoutError,
  userFacingNetworkErrorMessage,
} from '~/shared/lib/errors/network';

describe('network errors', () => {
  it('detects rate limits', () => {
    expect(isRateLimitError({ status: 429 })).toBe(true);
    expect(isRateLimitError({ statusCode: '429' })).toBe(true);
    expect(isRateLimitError({ code: 'over_request_rate_limit' })).toBe(true);
    expect(isRateLimitError({ message: 'Too many requests' })).toBe(true);
    expect(isRateLimitError({ message: 'ok' })).toBe(false);
  });

  it('detects timeouts and maps user copy', () => {
    expect(isTimeoutError(new ApiTimeoutError())).toBe(true);
    expect(isTimeoutError({ code: 'TIMEOUT' })).toBe(true);
    expect(isTimeoutError({ message: 'timed out' })).toBe(true);
    expect(userFacingNetworkErrorMessage(new ApiTimeoutError(), 'x')).toMatch(/timed out/i);
    expect(userFacingNetworkErrorMessage({ status: 429 }, 'x')).toMatch(/too many/i);
    expect(userFacingNetworkErrorMessage(new Error('boom'), 'fallback')).toBe('boom');
    expect(userFacingNetworkErrorMessage(null, 'fallback')).toBe('fallback');
  });
});
