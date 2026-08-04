import type { UpdateProfileInput } from '~/features/profile/types/profile';
import { normalizeHandleForSave } from '~/features/profile/lib/handle';
import type { CurrentlyData } from '~/features/profile/types/profile';

type Fields = {
  displayName: string;
  handle: string;
  bio: string;
  location: string;
  currently: CurrentlyData;
};

export function toUpdateProfileInput(fields: Fields): UpdateProfileInput {
  return {
    display_name: fields.displayName,
    handle: normalizeHandleForSave(fields.handle),
    bio: fields.bio || null,
    location: fields.location || null,
    currently_binging: fields.currently.binging || null,
    currently_listening_to: fields.currently.listening || null,
    currently_reading: fields.currently.reading || null,
  };
}
