export function isListCollapsible(items: readonly unknown[], collapsedCount: number): boolean {
  return items.length > collapsedCount;
}

export function visibleListItems<T>(
  items: readonly T[],
  showAll: boolean,
  collapsedCount: number,
): readonly T[] {
  return showAll ? items : items.slice(0, collapsedCount);
}
