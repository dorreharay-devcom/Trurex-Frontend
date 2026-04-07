import { Backend, unwrap } from '~/services/AuthService';
import type { ProfileData } from '~/types/profile';

interface UserRow {
  id: string;
  email: string;
  display_name: string;
  handle: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  currently_binging: string | null;
  currently_listening_to: string | null;
  currently_reading: string | null;
}

export interface UpdateProfileInput {
  display_name?: string | null;
  handle?: string | null;
  bio?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  currently_binging?: string | null;
  currently_listening_to?: string | null;
  currently_reading?: string | null;
}

function toProfileData(row: UserRow, email?: string): ProfileData {
  return {
    displayName: row.display_name || 'Anonymous',
    handle: row.handle ? `@${row.handle}` : `@${email?.split('@')[0] ?? 'user'}`,
    bio: row.bio ?? '',
    location: row.location ?? '',
    avatarUrl: row.avatar_url,
    trustScore: 87,
    rexCount: 0,
    followers: 0,
    following: 0,
    currently: {
      binging: row.currently_binging ?? undefined,
      listening: row.currently_listening_to ?? undefined,
      reading: row.currently_reading ?? undefined,
    },
  };
}

export const ProfileApi = {
  getById: async (userId: string, email?: string): Promise<ProfileData> => {
    const row = unwrap(await Backend.from('users').select('*').eq('id', userId).single<UserRow>());
    return toProfileData(row, email);
  },

  update: async (userId: string, fields: UpdateProfileInput): Promise<void> => {
    unwrap(await Backend.from('users').update(fields).eq('id', userId));
  },

  uploadAvatar: async (userId: string, uri: string): Promise<string> => {
    const ext = uri.split('.').pop() ?? 'jpg';
    const path = `${userId}/avatar.${ext}`;
    const blob = await fetch(uri).then((r) => r.blob());
    unwrap(await Backend.storage.from('recommendation-images').upload(path, blob, {
      upsert: true,
      contentType: `image/${ext}`,
    }));
    const { data } = Backend.storage.from('recommendation-images').getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
  },
};
