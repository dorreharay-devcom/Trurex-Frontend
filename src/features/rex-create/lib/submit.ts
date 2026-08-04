import type { QueryClient } from '@tanstack/react-query';
import type { CreateConfigState } from '~/features/rex-create/hooks/useCategoryCreateConfig';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import { getLinkedPlaceId, getPlaceNameForRex } from '~/features/rex-create/lib/place';
import {
  canPostCreateRexShare,
  hasNonPublicMockCircleSelection,
  resolveCreateRexCircleIds,
  resolveCreateRexVisibility,
} from '~/features/rex-create/lib/sharing';
import { SEARCH_MODE } from '~/features/rex-create/types/create';
import { REX_VISIBILITY } from '~/features/rex-create/lib/sharing';
import type { CategoryQuestion } from '~/features/rex-create/types/categoryCreateConfig';
import { REX_QUERY_KEYS } from '~/shared/config/queryKeys';

export function createRexErrorMessage(
  rawMessage: string,
  fallback = 'Something went wrong.',
): string {
  if (/invalid circle id/i.test(rawMessage)) {
    return 'Select a valid sharing circle before posting.';
  }
  return rawMessage.trim() || fallback;
}

export function buildCategoryRatingsPayload(
  scores: Record<string, number | null>,
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(scores).filter(([, v]) => v != null) as [string, number][],
  );
}

export function buildQuestionAnswersPayload(
  questions: CategoryQuestion[],
  answers: Record<string, string | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const q of questions) {
    const v = answers[q.code];
    const trimmed = v?.trim() ?? '';
    if (trimmed) {
      out[q.code] = q.type === 'text' ? trimmed : v!;
    } else if (q.is_required) {
      throw new Error(`Please answer: ${q.display_label}`);
    }
  }
  return out;
}

export type SubmitBlocker = { toast: 'error' | 'info'; title: string; message: string };

export function findSubmitBlocker(
  flow: CreateRecFlow,
  config: CreateConfigState,
): SubmitBlocker | null {
  const { scorecard, circles } = flow;
  if (!config.categoryApiCode || !config.activeCreateConfig) {
    return {
      toast: 'error',
      title: 'Category unavailable',
      message:
        'Could not load category configuration. Check your connection and try again, or pick another category.',
    };
  }
  const missingRequired = config.mergedQuestions.find(
    (q) => q.is_required && !scorecard.questionAnswers[q.code]?.trim(),
  );
  if (missingRequired) {
    return {
      toast: 'info',
      title: 'Almost there',
      message: `Please answer: ${missingRequired.display_label}`,
    };
  }
  if (
    !circles.privateRex &&
    hasNonPublicMockCircleSelection(circles.selectedCircleIds, circles.publicCircleId)
  ) {
    return {
      toast: 'info',
      title: 'Circles',
      message:
        'Sharing to named circles requires account circle IDs from the server. Select Public only for now, or wire circle loading.',
    };
  }
  if (
    !canPostCreateRexShare(circles.privateRex, circles.selectedCircleIds, circles.publicCircleId)
  ) {
    return {
      toast: 'info',
      title: 'Circles',
      message: 'Select a sharing circle before posting.',
    };
  }
  return null;
}

export function buildCreateRexParams(
  flow: CreateRecFlow,
  config: CreateConfigState,
  categoryApiCode: string,
) {
  const { place, scorecard, circles, photos } = flow;
  const isOnline = place.searchMode === SEARCH_MODE.online;
  const p_visibility = resolveCreateRexVisibility(
    circles.selectedCircleIds,
    circles.privateRex,
    circles.publicCircleId,
  );
  return {
    p_category_code: categoryApiCode,
    p_place_name: getPlaceNameForRex(
      place.searchMode,
      place.selectedSearchPlace,
      place.manualName,
      place.onlineName,
    ),
    p_review: scorecard.scoreReview.trim() || null,
    p_must_know: config.showQuickTip ? scorecard.scoreQuickTip.trim() || null : null,
    p_visibility,
    circle_ids:
      p_visibility === REX_VISIBILITY.circles
        ? resolveCreateRexCircleIds(circles.selectedCircleIds, circles.publicCircleId)
        : undefined,
    tag_names: scorecard.selectedTagSlugs,
    photo_paths: photos.paths.length > 0 ? photos.paths : null,
    p_linked_place_id: isOnline ? null : (getLinkedPlaceId(place.linkedPlaceId) ?? undefined),
    p_is_online_place: isOnline,
    p_place_website_url: isOnline ? place.onlineWebsiteUrl.trim() || null : null,
    p_location_text: isOnline ? place.onlineLocationText.trim() || null : null,
    p_category_ratings: buildCategoryRatingsPayload(scorecard.categoryRatings),
    p_question_answers: buildQuestionAnswersPayload(
      config.mergedQuestions,
      scorecard.questionAnswers,
    ),
    p_score_value_for_money: scorecard.scoreValueForMoney ?? null,
    p_subcategory_code: config.subcategoryCodeForMerge ?? undefined,
  };
}

export function invalidateRexQueries(queryClient: QueryClient, editRexId: string | null) {
  queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.discoverFeed });
  queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.searchRexes });
  queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.myRexes });
  queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.mySavedRexes });
  queryClient.invalidateQueries({ queryKey: ['collection-detail'] });
  queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.mapRexesInBounds });
  queryClient.invalidateQueries({ queryKey: REX_QUERY_KEYS.mapRexPins });
  if (editRexId == null) return;
  queryClient.invalidateQueries({ queryKey: ['rexDetail', editRexId] });
  queryClient.invalidateQueries({ queryKey: ['rexForEdit', editRexId] });
}
