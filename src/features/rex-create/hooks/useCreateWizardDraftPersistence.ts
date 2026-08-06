import { useEffect, useRef, useState } from 'react';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import {
  buildCreateWizardDraft,
  clearCreateWizardDraft,
  createWizardDraftIsMeaningful,
  loadCreateWizardDraft,
  saveCreateWizardDraft,
} from '~/features/rex-create/lib/createWizardDraft';
import { STEP_ID } from '~/features/rex-create/types/create';

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
  const [restoreReady, setRestoreReady] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flowRef = useRef(flow);
  flowRef.current = flow;

  const cancelPendingSave = () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
  };

  useEffect(() => {
    if (!visible) {
      setRestoreReady(false);
      cancelPendingSave();
      return;
    }

    if (isEditMode || hasExternalPrefill) {
      void clearCreateWizardDraft();
      setRestoreReady(true);
      return;
    }

    let cancelled = false;
    setRestoreReady(false);

    void (async () => {
      const draft = await loadCreateWizardDraft();
      if (cancelled) return;

      const { place, category, scorecard, circles, photos, nav } = flowRef.current;

      if (draft && createWizardDraftIsMeaningful(draft)) {
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
      } else {
        await clearCreateWizardDraft();
        if (nav.stepId !== STEP_ID.search) {
          nav.reset();
        }
      }

      if (!cancelled) setRestoreReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [visible, isEditMode, hasExternalPrefill]);

  useEffect(() => {
    if (!visible || isEditMode || hasExternalPrefill || !restoreReady) return;

    cancelPendingSave();
    saveTimer.current = setTimeout(() => {
      const f = flowRef.current;
      const draft = buildCreateWizardDraft({
        searchMode: f.place.searchMode,
        searchQuery: f.place.searchQuery,
        selectedSearchPlace: f.place.selectedSearchPlace,
        manual: {
          name: f.place.manualName,
          address: f.place.manualAddress,
          geotag: f.place.manualGeotag,
        },
        online: {
          name: f.place.onlineName,
          websiteUrl: f.place.onlineWebsiteUrl,
          locationText: f.place.onlineLocationText,
          geotag: f.place.onlineGeotag,
        },
        selectedCategoryId: f.category.selectedCategoryId,
        selectedSubcategoryCode: f.category.selectedSubcategoryCode,
        scoreQuickTip: f.scorecard.scoreQuickTip,
        scoreReview: f.scorecard.scoreReview,
        scoreValueForMoney: f.scorecard.scoreValueForMoney,
        categoryRatings: f.scorecard.categoryRatings,
        questionAnswers: f.scorecard.questionAnswers,
        selectedTagSlugs: f.scorecard.selectedTagSlugs,
        photoStoragePaths: f.photos.paths,
        selectedCircleIds: [...f.circles.selectedCircleIds],
        privateRex: f.circles.privateRex,
      });
      void saveCreateWizardDraft(draft);
    }, SAVE_DEBOUNCE_MS);

    return () => {
      cancelPendingSave();
    };
  }, [
    visible,
    isEditMode,
    hasExternalPrefill,
    restoreReady,
    flow.place.searchMode,
    flow.place.searchQuery,
    flow.place.selectedSearchPlace,
    flow.place.manualName,
    flow.place.manualAddress,
    flow.place.manualGeotag,
    flow.place.onlineName,
    flow.place.onlineWebsiteUrl,
    flow.place.onlineLocationText,
    flow.place.onlineGeotag,
    flow.category.selectedCategoryId,
    flow.category.selectedSubcategoryCode,
    flow.scorecard.scoreQuickTip,
    flow.scorecard.scoreReview,
    flow.scorecard.scoreValueForMoney,
    flow.scorecard.categoryRatings,
    flow.scorecard.questionAnswers,
    flow.scorecard.selectedTagSlugs,
    flow.photos.paths,
    flow.circles.selectedCircleIds,
    flow.circles.privateRex,
  ]);

  return {
    clearDraft: clearCreateWizardDraft,
    cancelPendingSave,
  };
}
