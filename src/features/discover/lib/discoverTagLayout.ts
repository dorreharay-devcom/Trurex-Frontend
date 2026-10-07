export const DISCOVER_TAG_ROW_GAP = 6;
export const DISCOVER_TAG_MAX_ROWS = 2;

export type DiscoverTagMeasurements = {
  tagWidths: readonly number[];
  overflowWidthByDigits: Readonly<Record<number, number>>;
};

export function discoverOverflowLabel(hiddenCount: number): string {
  return `+${hiddenCount}`;
}

export function discoverTagLabel(tag: string): string {
  return `#${tag}`;
}

export function overflowWidthForCount(
  hiddenCount: number,
  overflowWidthByDigits: Readonly<Record<number, number>>,
): number {
  const digits = String(hiddenCount).length;
  return overflowWidthByDigits[digits] ?? overflowWidthByDigits[3] ?? overflowWidthByDigits[1];
}

export function fitsWithinRows(
  itemWidths: readonly number[],
  rowWidth: number,
  gap: number,
  maxRows: number,
  trailingWidth = 0,
): boolean {
  if (rowWidth <= 0) return false;

  let row = 0;
  let usedWidth = 0;

  const place = (width: number): boolean => {
    if (width <= 0) return true;

    const spacing = usedWidth > 0 ? gap : 0;
    if (usedWidth + spacing + width <= rowWidth) {
      usedWidth += spacing + width;
      return true;
    }

    if (row >= maxRows - 1) return false;

    row += 1;
    usedWidth = width;
    return width <= rowWidth;
  };

  for (const width of itemWidths) {
    if (!place(width)) return false;
  }

  return trailingWidth <= 0 || place(trailingWidth);
}

export function limitTagsToRows(
  tagWidths: readonly number[],
  rowWidth: number,
  overflowWidthByDigits: Readonly<Record<number, number>>,
  options?: { gap?: number; maxRows?: number },
): { visibleCount: number; hiddenCount: number } {
  const gap = options?.gap ?? DISCOVER_TAG_ROW_GAP;
  const maxRows = options?.maxRows ?? DISCOVER_TAG_MAX_ROWS;
  const total = tagWidths.length;

  if (total === 0 || rowWidth <= 0) {
    return { visibleCount: 0, hiddenCount: 0 };
  }

  if (fitsWithinRows(tagWidths, rowWidth, gap, maxRows)) {
    return { visibleCount: total, hiddenCount: 0 };
  }

  for (let visibleCount = total - 1; visibleCount >= 1; visibleCount -= 1) {
    const hiddenCount = total - visibleCount;
    const trailingWidth = overflowWidthForCount(hiddenCount, overflowWidthByDigits);

    if (fitsWithinRows(tagWidths.slice(0, visibleCount), rowWidth, gap, maxRows, trailingWidth)) {
      return { visibleCount, hiddenCount };
    }
  }

  // Always show at least one tag rather than an overflow badge with no context.
  return { visibleCount: 1, hiddenCount: total - 1 };
}

export function splitDiscoverTags(
  tags: readonly string[],
  measurements: DiscoverTagMeasurements,
  rowWidth: number,
): { visibleTags: string[]; hiddenCount: number } {
  const { visibleCount, hiddenCount } = limitTagsToRows(
    measurements.tagWidths,
    rowWidth,
    measurements.overflowWidthByDigits,
  );

  return {
    visibleTags: tags.slice(0, visibleCount),
    hiddenCount,
  };
}

export const DISCOVER_TAG_OVERFLOW_SAMPLES = [
  { digits: 1, label: '+9' },
  { digits: 2, label: '+99' },
  { digits: 3, label: '+999' },
] as const;

const tagWidthCache = new Map<string, number>();
const overflowWidthCache = new Map<number, number>();

export function cachedDiscoverTagMeasurements(
  tags: readonly string[],
): DiscoverTagMeasurements | null {
  const tagWidths = tags.map((tag) => tagWidthCache.get(discoverTagLabel(tag)));
  const overflowEntries = DISCOVER_TAG_OVERFLOW_SAMPLES.map(
    ({ digits }) => [digits, overflowWidthCache.get(digits)] as const,
  );

  const isFullyCached =
    tagWidths.every((width) => width !== undefined) &&
    overflowEntries.every(([, width]) => width !== undefined);

  if (!isFullyCached) return null;

  return {
    tagWidths: tagWidths as number[],
    overflowWidthByDigits: Object.fromEntries(overflowEntries) as Record<number, number>,
  };
}

export function recordDiscoverTagMeasurements(
  tags: readonly string[],
  tagWidths: readonly number[],
  overflowWidthByDigits: Readonly<Record<number, number>>,
): void {
  for (const [index, tag] of tags.entries()) {
    tagWidthCache.set(discoverTagLabel(tag), tagWidths[index]);
  }
  for (const { digits } of DISCOVER_TAG_OVERFLOW_SAMPLES) {
    overflowWidthCache.set(digits, overflowWidthByDigits[digits]);
  }
}
