import { describe, expect, it } from 'vitest';
import { withActingProfileHeader } from '~/shared/api/actingProfile';

const REST_URL = 'https://api.example.com/rest/v1/rpc/create_rex';
const FUNCTION_URL = 'https://api.example.com/functions/v1/circles';
const AUTH_URL = 'https://api.example.com/auth/v1/token';
const STORAGE_URL = 'https://api.example.com/storage/v1/object/sign/user-avatars/u/a.jpg';

describe('withActingProfileHeader', () => {
  it('adds the business header to RPC and edge function requests in business mode', () => {
    const fn = withActingProfileHeader(FUNCTION_URL, undefined, true);
    expect(new Headers(fn?.headers).get('x-acting-as')).toBe('business');
    const init = withActingProfileHeader(REST_URL, { headers: { apikey: 'key' } }, true);
    const headers = new Headers(init?.headers);
    expect(headers.get('x-acting-as')).toBe('business');
    expect(headers.get('apikey')).toBe('key');
  });

  it('leaves requests untouched in personal mode', () => {
    const init = { headers: { apikey: 'key' } };
    expect(withActingProfileHeader(REST_URL, init, false)).toBe(init);
  });

  it('never sends the header to login-level auth and storage endpoints', () => {
    const init = { headers: { apikey: 'key' } };
    expect(withActingProfileHeader(AUTH_URL, init, true)).toBe(init);
    expect(withActingProfileHeader(STORAGE_URL, init, true)).toBe(init);
  });
});
