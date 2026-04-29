import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import type { ProfileData } from '~/types/profile';

export function profileShareSlug(profile: Pick<ProfileData, 'handle' | 'userId'>): string {
  return profile.handle ? profile.handle.replace(/^@/, '') : profile.userId;
}

export function buildProfileShareUrl(slug: string): string {
  if (!slug) return '';
  return Platform.OS === 'web'
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/user/${slug}`
    : Linking.createURL(`/user/${slug}`);
}
