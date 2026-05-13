export const REX_PHOTO_PLACEHOLDER_STORAGE_PATH = 'placeholder.svg';

export function isRexPlaceholderPhotoPath(p: string | null | undefined): boolean {
  return (p?.trim().toLowerCase() ?? '') === REX_PHOTO_PLACEHOLDER_STORAGE_PATH.toLowerCase();
}
