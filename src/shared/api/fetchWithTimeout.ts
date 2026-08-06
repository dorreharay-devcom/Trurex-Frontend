export const DEFAULT_API_TIMEOUT_MS = 30_000;

export class ApiTimeoutError extends Error {
  readonly name = 'ApiTimeoutError';
  readonly code = 'TIMEOUT';

  constructor(message = 'Request timed out. Check your connection and try again.') {
    super(message);
  }
}

export function isAbortError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') return true;
  if (error instanceof Error && error.name === 'AbortError') return true;
  return false;
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = DEFAULT_API_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const external = init?.signal;
  if (external?.aborted) {
    controller.abort(external.reason);
  } else if (external) {
    external.addEventListener('abort', () => controller.abort(external.reason), { once: true });
  }

  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (error) {
    if (isAbortError(error) && !external?.aborted) {
      throw new ApiTimeoutError();
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
