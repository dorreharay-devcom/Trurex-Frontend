import { Platform } from 'react-native';
import type { ProfileData } from '~/types/profile';
import { buildCurrentWebPath, buildPublicWebPath } from '~/utils/shareUrls';

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
  return Platform.OS === 'web'
    ? buildCurrentWebPath(`/user/${slug}`)
    : buildPublicWebPath(`/user/${slug}`);
}
