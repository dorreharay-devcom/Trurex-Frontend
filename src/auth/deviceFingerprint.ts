import { encodeBase64 } from './base64';

export async function getDeviceFingerprint(): Promise<string> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userAgent = typeof navigator === 'undefined' ? 'unknown-web-device' : navigator.userAgent;

  return encodeBase64([userAgent, timezone].join('|'));
}
