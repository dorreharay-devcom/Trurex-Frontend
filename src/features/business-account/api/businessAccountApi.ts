import { BUSINESS_PHOTO_MAX_WIDTH } from '~/features/business-account/config/edit';
import { businessPhotoStoragePath } from '~/features/business-account/lib/businessProfileForm';
import { toBusinessProfile } from '~/features/business-account/lib/businessProfileRow';
import { toSubmitClaimParams } from '~/features/business-account/lib/claimTarget';
import type {
  BusinessProfile,
  UpdateBusinessProfileInput,
} from '~/features/business-account/types/businessProfile';
import type { ClaimTarget } from '~/features/business-account/types/claim';
import { Backend, unwrap } from '~/shared/api/client';
import { USER_AVATARS_BUCKET } from '~/shared/config/app';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';
import type { PickedLibraryImage } from '~/shared/lib/media/photos/imagePickerLaunch';
import {
  preparePickerImageForUpload,
  uploadBlobToStorageBucket,
} from '~/shared/lib/media/photos/storageUpload';

export const BusinessAccountApi = {
  getProfile: async (): Promise<BusinessProfile> =>
    toBusinessProfile(unwrap(await Backend.rpc('get_business_profile'))),

  submitClaim: async (target: ClaimTarget): Promise<void> => {
    throwRpcIfFailed(await Backend.rpc('submit_business_claim', toSubmitClaimParams(target)));
  },

  updateProfile: async (input: UpdateBusinessProfileInput): Promise<void> => {
    throwRpcIfFailed(await Backend.rpc('update_business_profile', input));
  },

  uploadPhoto: async (userId: string, image: PickedLibraryImage): Promise<string> => {
    const prepared = await preparePickerImageForUpload(
      image.uri,
      image.fileName,
      image.mimeType,
      BUSINESS_PHOTO_MAX_WIDTH,
    );
    const path = businessPhotoStoragePath(userId, Date.now());
    await uploadBlobToStorageBucket(USER_AVATARS_BUCKET, path, prepared.body, prepared.contentType);
    return path;
  },
};
