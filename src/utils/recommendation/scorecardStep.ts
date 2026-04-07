export function countFilledStarRatings(ratings: number[]): number {
  return ratings.filter((n) => n > 0).length;
}
