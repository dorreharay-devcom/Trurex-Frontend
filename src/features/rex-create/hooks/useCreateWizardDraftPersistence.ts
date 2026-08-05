import { useEffect, useRef } from 'react';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import {
  buildCreateWizardDraft,
  clearCreateWizardDraft,
  loadCreateWizardDraft,
  saveCreateWizardDraft,
} from '~/features/rex-create/lib/createWizardDraft';

const SAVE_DEBOUNCE_MS = 700;

type Args = {
  visible: boolean;
  isEditMode: boolean;
  hasExternalPrefill: boolean;
  flow: CreateRecFlow;
};

export function useCreateWizardDraftPersistence({
  visible,
  isEditMode,
  hasExternalPrefill,
  flow,
}: Args) {
  const restoredRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { place, category, scorecard, circles, photos } = flow;

  useEffect(() => {
    if (!visible) {
      restoredRef.current = false;
      return;
    }
    if (isEditMode || hasExternalPrefill || restoredRef.current) return;
    restoredRef.current = true;
    let cancelled = false;
    void (async () => {
      const draft = await loadCreateWizardDraft();
      if (cancelled || !draft) return;
      place.hydrateFromDraft({
        searchMode: draft.searchMode,
        searchQuery: draft.searchQuery,
        selectedSearchPlace: draft.selectedSearchPlace,
        manual: draft.manual,
        online: draft.online,
      });
      category.hydrateFromDraft({
        selectedCategoryId: draft.selectedCategoryId,
        selectedSubcategoryCode: draft.selectedSubcategoryCode,
      });
      scorecard.hydrateFromDraft({
        categoryRatings: draft.categoryRatings,
        questionAnswers: draft.questionAnswers,
        selectedTagSlugs: draft.selectedTagSlugs,
        scoreQuickTip: draft.scoreQuickTip,
        scoreValueForMoney: draft.scoreValueForMoney,
        scoreReview: draft.scoreReview,
      });
      circles.hydrateFromDraft({
        selectedCircleIds: draft.selectedCircleIds,
        privateRex: draft.privateRex,
      });
      photos.setPaths(draft.photoStoragePaths);
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, isEditMode, hasExternalPrefill, place, category, scorecard, circles, photos]);

  useEffect(() => {
    if (!visible || isEditMode || hasExternalPrefill) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const draft = buildCreateWizardDraft({
        searchMode: place.searchMode,
        searchQuery: place.searchQuery,
        selectedSearchPlace: place.selectedSearchPlace,
        manual: {
          name: place.manualName,
          address: place.manualAddress,
          geotag: place.manualGeotag,
        },
        online: {
          name: place.onlineName,
          websiteUrl: place.onlineWebsiteUrl,
          locationText: place.onlineLocationText,
          geotag: place.onlineGeotag,
        },
        selectedCategoryId: category.selectedCategoryId,
        selectedSubcategoryCode: category.selectedSubcategoryCode,
        scoreQuickTip: scorecard.scoreQuickTip,
        scoreReview: scorecard.scoreReview,
        scoreValueForMoney: scorecard.scoreValueForMoney,
        categoryRatings: scorecard.categoryRatings,
        questionAnswers: scorecard.questionAnswers,
        selectedTagSlugs: scorecard.selectedTagSlugs,
        photoStoragePaths: photos.paths,
        selectedCircleIds: [...circles.selectedCircleIds],
        privateRex: circles.privateRex,
      });
      void saveCreateWizardDraft(draft);
    }, SAVE_DEBOUNCE_MS);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [
    visible,
    isEditMode,
    hasExternalPrefill,
    place.searchMode,
    place.searchQuery,
    place.selectedSearchPlace,
    place.manualName,
    place.manualAddress,
    place.manualGeotag,
    place.onlineName,
    place.onlineWebsiteUrl,
    place.onlineLocationText,
    place.onlineGeotag,
    category.selectedCategoryId,
    category.selectedSubcategoryCode,
    scorecard.scoreQuickTip,
    scorecard.scoreReview,
    scorecard.scoreValueForMoney,
    scorecard.categoryRatings,
    scorecard.questionAnswers,
    scorecard.selectedTagSlugs,
    photos.paths,
    circles.selectedCircleIds,
    circles.privateRex,
  ]);

  return {
    clearDraft: clearCreateWizardDraft,
  };
}
