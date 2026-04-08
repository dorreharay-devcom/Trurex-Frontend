export type DetailRatingRow = { label: string; value: number };

export function buildDetailRatingRows(rating: number | undefined): DetailRatingRow[] {
  const base = rating ?? 4.5;
  return [
    { label: 'Overall quality', value: base },
    { label: 'Value for money', value: Math.max(1, base - 0.3) },
    { label: 'Service', value: Math.min(5, base + 0.1) },
  ];
}
