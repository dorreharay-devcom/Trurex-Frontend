import type { CategoryTagOption } from '~/types/recommendation/rexCategoryCreateConfig';
import type { CreateRecSearchPlace, SearchEntryMode } from '~/types/recommendation/create';

export const CONFIRM_PREVIEW_USER = {
  name: 'Alex Morgan',
  handle: '@alexmorgan',
  initials: 'AM',
} as const;

export function averageStarRating(ratings: number[]): string | null {
  const filled = ratings.filter((n) => n > 0);
  if (filled.length === 0) return null;
  const avg = filled.reduce((a, b) => a + b, 0) / filled.length;
  return (Math.round(avg * 10) / 10).toFixed(1);
}

export function averageCategoryRatings(
  scores: Record<string, number | null>,
  valueForMoney?: number | null,
): string | null {
  const filled = Object.values(scores).filter((n): n is number => n != null && n > 0);
  const nums = [...filled];
  if (valueForMoney != null && valueForMoney > 0) nums.push(valueForMoney);
  if (nums.length === 0) return null;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return (Math.round(avg * 10) / 10).toFixed(1);
}

export type ConfirmPreviewPlace = {
  title: string;
  addressLines: string[];
};

export function getConfirmPreviewPlace(
  searchMode: SearchEntryMode,
  selectedSearchPlace: CreateRecSearchPlace | null,
  manualName: string,
  manualAddress: string,
  manualGeotag: { lat: number; lng: number } | null,
): ConfirmPreviewPlace {
  if (searchMode === 'manual') {
    const geo =
      manualGeotag != null
        ? `Geotagged (${manualGeotag.lat.toFixed(4)}, ${manualGeotag.lng.toFixed(4)})`
        : null;
    return {
      title: manualName.trim() || '—',
      addressLines: [manualAddress.trim() || null, geo].filter(Boolean) as string[],
    };
  }
  if (!selectedSearchPlace) return { title: '—', addressLines: [] };
  const sub = selectedSearchPlace.subtitle.trim();
  return { title: selectedSearchPlace.title, addressLines: sub ? [sub] : [] };
}

export function getConfirmTagLabels(
  selectedSlugs: string[],
  tagOptions: CategoryTagOption[],
): string[] {
  const map = new Map(tagOptions.map((t) => [t.slug, t.label]));
  return selectedSlugs.map((s) => map.get(s) ?? s);
}

export function getConfirmCircleTitles(
  selectedCircleIds: Set<string>,
  lookup: readonly { id: string; title: string }[],
): string[] {
  const map = new Map(lookup.map((c) => [c.id, c.title]));
  return [...selectedCircleIds].map((id) => map.get(id)).filter((t): t is string => Boolean(t));
}
