import * as Clipboard from 'expo-clipboard';
import type { ProfileData } from '~/features/profile/types/profile';
import { isWeb } from '~/shared/lib/ui/platform';
import { toastSuccess } from '~/shared/lib/appToast';
import { shareMobileLink, buildShareUrl } from '~/shared/lib/share';
export function normalizeProfileHandleSlug(handle: string | null | undefined): string | null {
  if (!handle?.trim()) return null;
  const slug = handle.trim().replace(/^@/, '');
  return slug || null;
}

export function hasProfileUsername(handle: string | null | undefined): boolean {
  return normalizeProfileHandleSlug(handle) != null;
}

export function profileShareSlug(profile: Pick<ProfileData, 'handle' | 'userId'>): string {
  const fromHandle = normalizeProfileHandleSlug(profile.handle);
  if (fromHandle) return fromHandle;
  return profile.userId;
}

export function buildProfileShareUrl(slug: string): string {
  if (!slug) return '';
  return buildShareUrl(`/user/${slug}`);
}

export async function shareProfile(
  profile: Pick<ProfileData, 'handle' | 'userId' | 'displayName'>,
  isOwnProfile: boolean,
): Promise<void> {
  const slug = profileShareSlug(profile);
  const url = buildProfileShareUrl(slug);
  const name = profile.displayName || 'someone';
  const whose = isOwnProfile ? 'my' : `${name}'s`;

  try {
    if (isWeb) {
      await Clipboard.setStringAsync(url);
      toastSuccess('Link copied!');
      return;
    }
    await shareMobileLink({
      title: 'TruRex Profile',
      message: `Check out ${whose} profile on TruRex`,
      url,
    });
  } catch {
  }
}
