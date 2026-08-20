import { Backend, unwrap } from '~/shared/api/client';
import { USER_AVATARS_BUCKET } from '~/shared/config/app';
import { toProfileData } from '~/features/profile/lib/toProfileData';
import type {
  ProfileData,
  ProfileUserRow,
  UpdateProfileInput,
} from '~/features/profile/types/profile';
import { firstRecord } from '~/shared/lib/data/guards';
import {
  preparePickerImageForUpload,
  uploadBlobToStorageBucket,
} from '~/shared/lib/media/photos/storageUpload';

const AVATAR_MAX_WIDTH = 800;

function asProfileUserRow(data: unknown): ProfileUserRow {
  const record = firstRecord(data);
  if (record == null) throw new Error('Profile not found');
  const row = record as unknown as ProfileUserRow;
  return { ...row, id: row.user_id || row.id };
}

export const ProfileApi = {
  getCurrentUser: async (userId: string): Promise<ProfileUserRow> => {
    const data = unwrap(
      await Backend.rpc('get_user_profile', {
        input_user_id: userId,
      }),
    );
    return asProfileUserRow(data);
  },

  getProfile: async (params: { userId?: string; handle?: string }): Promise<ProfileData> => {
    const data = unwrap(
      await Backend.rpc('get_user_profile', {
        input_user_id: params.userId,
        input_handle: params.handle,
      }),
    );
    return toProfileData(asProfileUserRow(data));
  },

  update: async (_userId: string, fields: UpdateProfileInput): Promise<ProfileData> => {
    const data = unwrap(
      await Backend.rpc('update_my_profile', {
        input_display_name: fields.display_name,
        input_handle: fields.handle,
        input_bio: fields.bio,
        input_location: fields.location,
        input_currently_binging: fields.currently_binging,
        input_currently_listening_to: fields.currently_listening_to,
        input_currently_reading: fields.currently_reading,
      }),
    );
    return toProfileData(asProfileUserRow(data));
  },

  updateAvatar: async (avatarUrl: string): Promise<ProfileUserRow> => {
    const data = unwrap(
      await Backend.rpc('update_my_avatar_url', {
        input_avatar_url: avatarUrl,
      }),
    );
    return asProfileUserRow(data);
  },

  uploadAvatar: async (
    userId: string,
    imageUri: string,
    fileName?: string | null,
    mimeType?: string | null,
  ): Promise<string> => {
    const name = fileName ?? `avatar-${Date.now()}.jpg`;
    const prepared = await preparePickerImageForUpload(imageUri, name, mimeType, AVATAR_MAX_WIDTH);
    const path = `${userId}/avatar-${Date.now()}.jpg`;
    await uploadBlobToStorageBucket(USER_AVATARS_BUCKET, path, prepared.body, prepared.contentType);

    await ProfileApi.updateAvatar(path);

    const { data } = Backend.storage.from(USER_AVATARS_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },
};
