import DeviceInfo from 'react-native-device-info';
import { encodeBase64 } from '~/features/auth/lib/mfa/encodeBase64';

export async function getDeviceFingerprint(): Promise<string> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const deviceId = await Promise.resolve(DeviceInfo.getDeviceId());

  return encodeBase64([deviceId, timezone].join('|'));
}
