import type { PlaceRexRow } from '~/features/business/types/placeRex';

const MAX_HEADER_PHOTOS = 4;

export function pickBusinessHeaderPhotos(rows: readonly PlaceRexRow[]): string[] {
  return rows
    .slice(0, MAX_HEADER_PHOTOS)
    .map((row) => row.photo_paths[0])
    .filter((path): path is string => Boolean(path?.trim()));
}
