import type { ImageSource } from 'expo-image';
import { isHttpUrl } from '~/shared/lib/data/guards';

export const REX_PHOTO_PLACEHOLDER_STORAGE_PATH = 'placeholder.svg';

export const REX_PLACEHOLDER_IMAGE_SOURCE: ImageSource = require('@assets/placeholder.svg');

export function isRexPlaceholderPhotoPath(p: string | null | undefined): boolean {
  return (p?.trim().toLowerCase() ?? '') === REX_PHOTO_PLACEHOLDER_STORAGE_PATH.toLowerCase();
}

export function rexCoverStoragePathFromRecommendation(rec: {
  photoPath?: string | null;
  image?: string | null;
}): string | null {
  const explicit = rec.photoPath?.trim() ?? '';
  if (explicit) return explicit;
  const img = rec.image?.trim() ?? '';
  if (img && !isHttpUrl(img)) return img;
  return null;
}

export function rexPhotoStoragePathsFromRecommendation(rec: {
  photoPaths?: string[] | null;
  photoPath?: string | null;
}): string[] {
  const fromList = rec.photoPaths?.map((p) => p.trim()).filter(Boolean) ?? [];
  if (fromList.length > 0) return fromList;
  const one = rec.photoPath?.trim() ?? '';
  if (one) return [one];
  return [];
}

export function rexCoverRemoteHttpUrl(rec: { image?: string | null }): string | null {
  const img = rec.image?.trim() ?? '';
  if (img && isHttpUrl(img)) return img;
  return null;
}
