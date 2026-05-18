import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import type { ProfileData } from '~/types/profile';

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
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/user/${slug}`
    : Linking.createURL(`/user/${slug}`);
}
