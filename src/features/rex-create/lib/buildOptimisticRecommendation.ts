import type { CreateConfigState } from '~/features/rex-create/hooks/useCategoryCreateConfig';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import { getPlaceNameForRex } from '~/features/rex-create/lib/place';
import { SEARCH_MODE } from '~/features/rex-create/types/create';
import type { Recommendation } from '~/shared/types/recommendation';

export function resolveCreatePlaceCoords(flow: CreateRecFlow): {
  latitude: number;
  longitude: number;
} | null {
  const { place } = flow;
  if (place.searchMode === SEARCH_MODE.online) return null;

  if (place.searchMode === SEARCH_MODE.manual && place.manualGeotag) {
    return { latitude: place.manualGeotag.lat, longitude: place.manualGeotag.lng };
  }

  const selected = place.selectedSearchPlace;
  if (
    selected?.latitude != null &&
    selected?.longitude != null &&
    Number.isFinite(selected.latitude) &&
    Number.isFinite(selected.longitude)
  ) {
    return { latitude: selected.latitude, longitude: selected.longitude };
  }
  return null;
}

export function buildOptimisticRecommendationFromCreate(params: {
  rexId: string;
  flow: CreateRecFlow;
  config: CreateConfigState;
  authorId?: string;
  authorName?: string;
}): Recommendation {
  const { rexId, flow, config, authorId, authorName } = params;
  const placeName = getPlaceNameForRex(
    flow.place.searchMode,
    flow.place.selectedSearchPlace,
    flow.place.manualName,
    flow.place.onlineName,
  );
  const coords = resolveCreatePlaceCoords(flow);
  const code = config.categoryApiCode ?? flow.category.selectedCategoryId ?? '';

  return {
    id: rexId,
    title: placeName,
    description: flow.scorecard.scoreReview.trim() || null,
    categoryId: code,
    category: config.activeCreateConfig?.display_name ?? code,
    categoryIcon: null,
    authorId,
    location:
      flow.place.searchMode === SEARCH_MODE.online
        ? flow.place.onlineLocationText.trim() || undefined
        : flow.place.selectedSearchPlace?.subtitle || undefined,
    locationText:
      flow.place.searchMode === SEARCH_MODE.online
        ? flow.place.onlineLocationText.trim() || null
        : null,
    isOnlinePlace: flow.place.searchMode === SEARCH_MODE.online,
    latitude: coords?.latitude,
    longitude: coords?.longitude,
    rating: null,
    scoreValueForMoney: flow.scorecard.scoreValueForMoney,
    tags: flow.scorecard.selectedTagSlugs,
    photoPath: flow.photos.paths[0] ?? null,
    photoPaths: flow.photos.paths,
    createdAt: new Date().toISOString(),
    user: authorName ? { name: authorName, handle: '', avatar: '' } : null,
    likes: 0,
    comments: 0,
    saves: 0,
    isLiked: false,
    isSaved: false,
  };
}
