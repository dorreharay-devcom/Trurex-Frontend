export function countFilledStarRatings(ratings: number[]): number {
  return ratings.filter((n) => n > 0).length;
}

export function countFilledCategoryRatings(scores: Record<string, number | null>): number {
  return Object.values(scores).filter((n) => n != null && n > 0).length;
}

export function countScorecardFilledSlots(
  scores: Record<string, number | null>,
  valueForMoney: number | null,
): number {
  return countFilledCategoryRatings(scores) + (valueForMoney != null && valueForMoney > 0 ? 1 : 0);
}
