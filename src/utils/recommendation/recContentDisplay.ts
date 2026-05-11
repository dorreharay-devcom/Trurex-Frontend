import { REX_PHOTO_PLACEHOLDER_STORAGE_PATH } from '~/constants/rexPlaceholderPhoto';

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
  if (img && isHttpUrl(img)) return null;
  return REX_PHOTO_PLACEHOLDER_STORAGE_PATH;
}

export function rexPhotoStoragePathsFromRecommendation(rec: {
  photoPaths?: string[] | null;
  photoPath?: string | null;
}): string[] {
  const fromList = rec.photoPaths?.map((p) => p.trim()).filter(Boolean) ?? [];
  if (fromList.length > 0) return fromList;
  const one = rec.photoPath?.trim() ?? '';
  if (one) return [one];
  return [REX_PHOTO_PLACEHOLDER_STORAGE_PATH];
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

export const VALUE_FOR_MONEY_LABELS = [
  'Total Steal',
  'Budget-Friendly',
  'Good Value',
  'Worth It',
  'Splurge',
] as const;

export function valueForMoneyLabel(score: number): string | null {
  if (!Number.isFinite(score) || score < 1 || score > 5) return null;
  return VALUE_FOR_MONEY_LABELS[Math.round(score) - 1] ?? null;
}

type CategoryRatingEntry = { score?: unknown; label?: unknown };

export function averageScoreFromCategoryRatings(raw: unknown): number | undefined {
  if (raw == null || typeof raw !== 'object') return undefined;
  const scores: number[] = [];
  for (const v of Object.values(raw as Record<string, CategoryRatingEntry>)) {
    if (v == null || typeof v !== 'object') continue;
    const s = (v as CategoryRatingEntry).score;
    if (typeof s === 'number' && !Number.isNaN(s)) scores.push(s);
  }
  if (scores.length === 0) return undefined;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(avg * 10) / 10;
}

export type DetailRatingRow = { label: string; value: number };

export function buildDetailRatingRows(rating: number | undefined): DetailRatingRow[] {
  const base = rating ?? 4.5;
  return [
    { label: 'Overall quality', value: base },
    { label: 'Value for money', value: Math.max(1, base - 0.3) },
    { label: 'Service', value: Math.min(5, base + 0.1) },
  ];
}
