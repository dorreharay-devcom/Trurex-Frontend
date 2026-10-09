import type { DetailRatingRow } from '~/features/rex-detail/lib/detailRatings';
import type { PlaceScorecardEntry } from '~/features/business/types/placeSummary';

export function buildScorecardRows(
  scorecard: Record<string, PlaceScorecardEntry>,
): DetailRatingRow[] {
  return Object.values(scorecard)
    .filter((entry) => typeof entry.avg_score === 'number' && !Number.isNaN(entry.avg_score))
    .map((entry) => ({ label: entry.label, value: entry.avg_score }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
