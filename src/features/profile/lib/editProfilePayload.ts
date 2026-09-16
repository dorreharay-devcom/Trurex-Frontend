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
    bio: fields.bio,
    location: fields.location,
    currently_binging: fields.currently.binging,
    currently_listening_to: fields.currently.listening,
    currently_reading: fields.currently.reading,
  };
}
