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
