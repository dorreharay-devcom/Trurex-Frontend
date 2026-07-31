import type { CreateRecCircle } from '~/types/circles';
import { isNonEmptyString } from '~/utils/guards';

export function canRenameCreateRecCircle(c: CreateRecCircle): boolean {
  return c.systemKind == null || c.systemKind === '';
}

export function findRenameableCircleById(
  rows: CreateRecCircle[],
  id: string | null,
): CreateRecCircle | undefined {
  if (id == null || !isNonEmptyString(id)) return undefined;
  const row = rows.find((c) => c.id === id);
  if (row == null || !canRenameCreateRecCircle(row)) return undefined;
  return row;
}

export const RING_CENTER_DIAMETER = 56;
export const RING_INNERMOST_USER_RING = RING_CENTER_DIAMETER + 28;
export const RING_CANVAS_MAX = 340;

export function ringCanvasSize(windowWidth: number): number {
  return Math.min(RING_CANVAS_MAX, Math.max(260, windowWidth - 48));
}

export type RingDiameterFns = {
  outerDiameter: (distanceFromInner: number) => number;
  innerHoleDiameter: (distanceFromInner: number) => number;
};

export function ringDiameterFns(canvas: number, ringCount: number): RingDiameterFns {
  if (ringCount <= 1) {
    return {
      outerDiameter: () => canvas - 16,
      innerHoleDiameter: () => RING_CENTER_DIAMETER,
    };
  }
  const step = (canvas - RING_INNERMOST_USER_RING) / (ringCount - 1);
  const outerDiameter = (d: number) => RING_INNERMOST_USER_RING + step * d;
  const innerHoleDiameter = (d: number) => (d <= 0 ? RING_CENTER_DIAMETER : outerDiameter(d - 1));
  return { outerDiameter, innerHoleDiameter };
}

export type SelectionAnnulus = {
  key: string;
  outer: number;
  inner: number;
  color: string;
};

export function effectiveCirclesAfterLoadError(
  loadError: boolean,
  circles: CreateRecCircle[],
): CreateRecCircle[] {
  return loadError ? [] : circles;
}

export function partitionPublicAndPrivateRings(rows: CreateRecCircle[]): {
  publicCircle: CreateRecCircle | undefined;
  ringsInnerToBroader: CreateRecCircle[];
} {
  if (rows.length === 0) return { publicCircle: undefined, ringsInnerToBroader: [] };
  const publicCircle = rows[rows.length - 1]!;
  const ringsInnerToBroader = rows.slice(0, -1);
  return { publicCircle, ringsInnerToBroader };
}

export function ringPaintOrderBackToFront(
  publicCircle: CreateRecCircle,
  ringsInnerToBroader: CreateRecCircle[],
): CreateRecCircle[] {
  return [publicCircle, ...ringsInnerToBroader.slice().reverse()];
}

export function selectionAnnuliLargestFirst(
  ringsInnerToBroader: CreateRecCircle[],
  publicCircle: CreateRecCircle,
  selectedIds: Set<string>,
  outerDiameter: (d: number) => number,
  innerHoleDiameter: (d: number) => number,
  ringCount: number,
): SelectionAnnulus[] {
  const annuli: SelectionAnnulus[] = ringsInnerToBroader
    .map((c, d) =>
      selectedIds.has(c.id)
        ? {
            key: c.id,
            outer: outerDiameter(d),
            inner: innerHoleDiameter(d),
            color: c.accent,
          }
        : null,
    )
    .filter((x): x is SelectionAnnulus => x != null);

  if (selectedIds.has(publicCircle.id)) {
    const d = ringCount - 1;
    annuli.push({
      key: publicCircle.id,
      outer: outerDiameter(d),
      inner: innerHoleDiameter(d),
      color: publicCircle.accent,
    });
  }

  return annuli.sort((a, b) => b.outer - a.outer);
}

export function distanceFromInnerForRingId(
  id: string,
  publicCircle: CreateRecCircle,
  ringsInnerToBroader: CreateRecCircle[],
  ringCount: number,
): number {
  if (id === publicCircle.id) return ringCount - 1;
  const idx = ringsInnerToBroader.findIndex((c) => c.id === id);
  return idx >= 0 ? idx : 0;
}

export function circleFooterSubtitle(c: CreateRecCircle): string {
  if (c.systemKind === 'broader_network') return 'Visible to anyone on TruRex';
  const n = c.memberCount;
  return `${n} ${n === 1 ? 'member' : 'members'}`;
}
