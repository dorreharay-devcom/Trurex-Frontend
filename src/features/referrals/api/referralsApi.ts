import { Backend, unwrap } from '~/shared/api/client';
import type { ReferralInfo } from '~/features/referrals/types/referral';

export async function fetchMyReferralInfo(): Promise<ReferralInfo | null> {
  const data = unwrap(await Backend.rpc('get_my_referral_info'));
  return Array.isArray(data) ? ((data[0] as ReferralInfo) ?? null) : null;
}
