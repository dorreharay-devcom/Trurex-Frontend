import { Backend } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';

export type PushPlatform = 'ios' | 'android' | 'web';

export async function registerPushToken(token: string, platform: PushPlatform): Promise<void> {
  throwRpcIfFailed(
    await Backend.rpc('register_push_token', {
      input_token: token,
      input_platform: platform,
    }),
  );
}

export async function unregisterPushToken(token: string): Promise<void> {
  throwRpcIfFailed(
    await Backend.rpc('unregister_push_token', {
      input_token: token,
    }),
  );
}
