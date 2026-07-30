import { encodeBase64 } from '~/shared/lib/encodeBase64';

export async function getDeviceFingerprint(): Promise<string> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userAgent = globalThis.navigator?.userAgent ?? 'unknown-web-device';

  return encodeBase64([userAgent, timezone].join('|'));
}
