import { CREATE_REC_SEARCH_PLACES } from '~/constants/recommendation/mockSearchPlaces';
import { CREATE_REC_CIRCLES } from '~/constants/recommendation/createCircles';
import { CREATE_REC_SCORE_CHIPS } from '~/constants/recommendation/createScorecard';
import type { SearchEntryMode } from '~/types/recommendation/create';

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

export type ConfirmPreviewPlace = {
  title: string;
  addressLines: string[];
};

export function getConfirmPreviewPlace(
  searchMode: SearchEntryMode,
  selectedPlaceId: string | null,
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
  const p = selectedPlaceId
    ? CREATE_REC_SEARCH_PLACES.find((x) => x.id === selectedPlaceId)
    : undefined;
  if (!p) return { title: '—', addressLines: [] };
  return { title: p.title, addressLines: [p.subtitle] };
}

export function getConfirmAppliesLabels(scoreAppliesSelected: Record<string, boolean>): string[] {
  return CREATE_REC_SCORE_CHIPS.filter((c) => scoreAppliesSelected[c]);
}

export function getConfirmCircleTitles(selectedCircleIds: Set<string>): string[] {
  return CREATE_REC_CIRCLES.filter((c) => selectedCircleIds.has(c.id)).map((c) => c.title);
}
