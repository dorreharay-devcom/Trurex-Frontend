export function nextPageOffset(
  lastPage: readonly unknown[],
  allPages: readonly unknown[][],
  pageLimit: number,
): number | undefined {
  const isFullPage = lastPage.length === pageLimit;
  if (!isFullPage) return undefined;
  return allPages.length * pageLimit;
}
