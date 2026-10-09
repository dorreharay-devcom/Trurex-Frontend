import type { CategoryRatingRead } from '~/features/rex-detail/types/rexDetail';

export function averagePlaceRexScore(
  categoryRatings: Record<string, CategoryRatingRead>,
): number | null {
  const scores = Object.values(categoryRatings)
    .map((entry) => entry.score)
    .filter((score): score is number => typeof score === 'number' && score > 0);

  if (scores.length === 0) return null;

  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(average * 10) / 10;
}
