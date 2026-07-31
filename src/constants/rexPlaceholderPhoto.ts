import type { ImageSource } from 'expo-image';

export const REX_PHOTO_PLACEHOLDER_STORAGE_PATH = 'placeholder.svg';

export function isRexPlaceholderPhotoPath(p: string | null | undefined): boolean {
  return (p?.trim().toLowerCase() ?? '') === REX_PHOTO_PLACEHOLDER_STORAGE_PATH.toLowerCase();
}

export const REX_PLACEHOLDER_IMAGE_SOURCE: ImageSource = require('@assets/placeholder.svg');
