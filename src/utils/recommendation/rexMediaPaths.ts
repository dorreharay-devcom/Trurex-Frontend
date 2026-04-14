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
