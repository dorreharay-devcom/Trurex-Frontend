export function isHttpUrl(s: string): boolean {
  return /^https?:\/\//i.test(s.trim());
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

/** All gallery storage keys in order; first is the feed cover. */
export function rexPhotoStoragePathsFromRecommendation(rec: {
  photoPaths?: string[] | null;
  photoPath?: string | null;
}): string[] {
  const fromList = rec.photoPaths?.map((p) => p.trim()).filter(Boolean) ?? [];
  if (fromList.length > 0) return fromList;
  const one = rec.photoPath?.trim() ?? '';
  return one ? [one] : [];
}

export function rexCoverRemoteHttpUrl(rec: { image?: string | null }): string | null {
  const img = rec.image?.trim() ?? '';
  if (img && isHttpUrl(img)) return img;
  return null;
}

export function userAvatarStoragePath(avatar: string | undefined | null): string | null {
  const a = avatar?.trim() ?? '';
  if (!a || isHttpUrl(a)) return null;
  return a;
}

export function userAvatarHttpUrl(avatar: string | undefined | null): string | null {
  const a = avatar?.trim() ?? '';
  if (a && isHttpUrl(a)) return a;
  return null;
}
