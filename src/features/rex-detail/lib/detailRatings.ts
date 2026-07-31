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

export function buildDetailRatingsFromRexDetail(
  detail: RexDetailRatingsSource,
): DetailRatingsDisplay {
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
