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
  'Bargain Find',
  'Cheap&Cheerful',
  'Fair&Solid',
  'Expensive But Worth It',
  'Felt Like A Rip-off',
] as const;

export function valueForMoneyLabel(score: number): string | null {
  if (!Number.isFinite(score) || score < 1 || score > 5) return null;
  return VALUE_FOR_MONEY_LABELS[Math.round(score) - 1] ?? null;
}

export type DetailRatingRow = {
  label: string;
  value: number;
};

export type DetailRatingsDisplay = {
  overall: DetailRatingRow | null;
  dimensions: DetailRatingRow[];
};

type RexDetailRatingsSource = {
  overall_rating?: number | null;
  category_ratings: Record<
    string,
    { label?: string | null; display_label?: string | null; score?: number | null }
  >;
};

export function buildDetailRatingsFromRexDetail(detail: RexDetailRatingsSource): DetailRatingsDisplay {
  const dimensions = Object.entries(detail.category_ratings)
    .map(([code, entry]) => {
      const score = entry?.score;
      if (typeof score !== 'number' || Number.isNaN(score) || score <= 0) return null;
      const label =
        (typeof entry.display_label === 'string' && entry.display_label.trim()) ||
        (typeof entry.label === 'string' && entry.label.trim()) ||
        code;
      return { label, value: score };
    })
    .filter((row): row is DetailRatingRow => row != null)
    .sort((a, b) => a.label.localeCompare(b.label));

  const overallRaw = detail.overall_rating;
  const overallScore =
    typeof overallRaw === 'number' && !Number.isNaN(overallRaw) && overallRaw > 0
      ? Math.round(overallRaw * 10) / 10
      : null;

  return {
    overall: overallScore != null ? { label: 'Overall quality', value: overallScore } : null,
    dimensions,
  };
}
