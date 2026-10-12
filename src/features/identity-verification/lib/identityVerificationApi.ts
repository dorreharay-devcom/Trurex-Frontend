import { Backend, unwrap } from '~/shared/api/client';

export async function markIdentityVerified(): Promise<void> {
  unwrap(await Backend.rpc('verify_my_identity', {}));
}
