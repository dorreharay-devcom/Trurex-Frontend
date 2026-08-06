import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApiTimeoutError, fetchWithTimeout, isAbortError } from '~/shared/api/fetchWithTimeout';

afterEach(() => {
  vi.unstubAllGlobals();
});

function abortingFetch(): typeof fetch {
  return ((_input, init) =>
    new Promise((_resolve, reject) => {
      const rejectAbort = () => {
        const err = new Error('Aborted');
        err.name = 'AbortError';
        reject(err);
      };
      if (init?.signal?.aborted) {
        rejectAbort();
        return;
      }
      init?.signal?.addEventListener('abort', rejectAbort, { once: true });
    })) as typeof fetch;
}

describe('isAbortError', () => {
  it('detects AbortError shapes', () => {
    expect(isAbortError(new DOMException('aborted', 'AbortError'))).toBe(true);
    const err = new Error('aborted');
    err.name = 'AbortError';
    expect(isAbortError(err)).toBe(true);
    expect(isAbortError(new Error('other'))).toBe(false);
  });
});

describe('fetchWithTimeout', () => {
  it('returns response when fetch resolves in time', async () => {
    const response = new Response('ok', { status: 200 });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => response),
    );
    await expect(fetchWithTimeout('https://example.com', undefined, 1000)).resolves.toBe(response);
  });

  it('maps timed-out abort to ApiTimeoutError', async () => {
    vi.stubGlobal('fetch', abortingFetch());
    await expect(fetchWithTimeout('https://example.com', undefined, 20)).rejects.toBeInstanceOf(
      ApiTimeoutError,
    );
  });

  it('propagates external abort without timeout error', async () => {
    vi.stubGlobal('fetch', abortingFetch());
    const controller = new AbortController();
    const pending = fetchWithTimeout('https://example.com', {
      signal: controller.signal,
    });
    controller.abort();
    await expect(pending).rejects.not.toBeInstanceOf(ApiTimeoutError);
  });
});
