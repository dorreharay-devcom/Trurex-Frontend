import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import { canProceedForStep, suggestedCategoryFromSearch } from '~/features/rex-create/lib/steps';
import { useCategorySelection } from '~/features/rex-create/hooks/wizard/useCategorySelection';
import { usePlaceSearch } from '~/features/rex-create/hooks/wizard/usePlaceSearch';
import { useScorecard } from '~/features/rex-create/hooks/wizard/useScorecard';
import { useShareCircles } from '~/features/rex-create/hooks/wizard/useShareCircles';
import { useStepNavigation } from '~/features/rex-create/hooks/wizard/useStepNavigation';
import { STEP_ID } from '~/types/recommendation/create';
import type { CategoryRatingDimension } from '~/types/recommendation/rexCategoryCreateConfig';
import type { RexForEditRow } from '~/types/recommendation/rexDetail';

export type CreateRecFlow = ReturnType<typeof useCreateRecWizard>;

export function useCreateRecWizard() {
  const categoryCodePrefillRef = useRef<string | null>(null);
  const editPrefillRef = useRef<RexForEditRow | null>(null);
  const editSessionRef = useRef(false);

  const place = usePlaceSearch();
  const category = useCategorySelection();
  const scorecard = useScorecard();
  const circles = useShareCircles();
  const nav = useStepNavigation(category.activeSteps);
  const [photoStoragePaths, setPhotoStoragePaths] = useState<string[]>([]);

  const { selectedCategoryId, setSelectedCategoryId, setSelectedSubcategoryCode } = category;
  const { clearLinkedPlace } = place;
  const { clear: clearScorecard } = scorecard;
  const { stepId } = nav;

  useEffect(() => {
    if (editPrefillRef.current?.category_code === selectedCategoryId) {
      category.setHasSubcategoryStep(false);
      return;
    }
    editPrefillRef.current = null;
    setSelectedSubcategoryCode(null);
    category.setHasSubcategoryStep(false);
    clearScorecard();
  }, [
    selectedCategoryId,
    setSelectedSubcategoryCode,
    category.setHasSubcategoryStep,
    clearScorecard,
  ]);

  useEffect(() => {
    clearLinkedPlace();
  }, [selectedCategoryId, clearLinkedPlace]);

  useEffect(() => {
    if (stepId === STEP_ID.search && !editSessionRef.current) {
      setSelectedCategoryId(null);
    }
  }, [stepId, setSelectedCategoryId]);

  useEffect(() => {
    if (stepId !== STEP_ID.category) return;
    if (selectedCategoryId !== null) return;
    const pending = categoryCodePrefillRef.current;
    if (pending) {
      setSelectedCategoryId(pending);
      categoryCodePrefillRef.current = null;
      return;
    }
    const sug = suggestedCategoryFromSearch(place.searchMode, place.selectedSearchPlace);
    if (sug) setSelectedCategoryId(sug);
  }, [
    stepId,
    selectedCategoryId,
    setSelectedCategoryId,
    place.searchMode,
    place.selectedSearchPlace,
  ]);

  const autoSuggestedCategoryId = useMemo(
    () => suggestedCategoryFromSearch(place.searchMode, place.selectedSearchPlace),
    [place.searchMode, place.selectedSearchPlace],
  );

  const canProceed = useMemo(
    () =>
      canProceedForStep(stepId, {
        searchMode: place.searchMode,
        manualName: place.manualName,
        manualAddress: place.manualAddress,
        manualGeotag: place.manualGeotag,
        onlineName: place.onlineName,
        selectedSearchPlace: place.selectedSearchPlace,
        selectedCategoryId,
        selectedCircleIds: circles.selectedCircleIds,
        privateRex: circles.privateRex,
        selectedSubcategoryCode: category.selectedSubcategoryCode,
      }),
    [
      stepId,
      place.searchMode,
      place.manualName,
      place.manualAddress,
      place.manualGeotag,
      place.onlineName,
      place.selectedSearchPlace,
      selectedCategoryId,
      circles.selectedCircleIds,
      circles.privateRex,
      category.selectedSubcategoryCode,
    ],
  );

  const syncFormToConfig = useCallback(
    (dimensions: CategoryRatingDimension[]) => {
      const edit =
        editPrefillRef.current?.category_code === selectedCategoryId
          ? editPrefillRef.current
          : null;
      scorecard.syncToConfig(dimensions, edit);
      if (edit) editPrefillRef.current = null;
    },
    [selectedCategoryId, scorecard.syncToConfig],
  );

  const reset = useCallback(() => {
    categoryCodePrefillRef.current = null;
    editPrefillRef.current = null;
    editSessionRef.current = false;
    nav.reset();
    place.reset();
    category.reset();
    scorecard.clear();
    circles.reset();
    setPhotoStoragePaths([]);
  }, [nav.reset, place.reset, category.reset, scorecard.clear, circles.reset]);

  const applyAddYourOwnPrefill = useCallback(
    (source: AddYourOwnRecSource) => {
      reset();
      place.prefillFromAddYourOwn(source);
      categoryCodePrefillRef.current = source.categoryCode;
    },
    [reset, place.prefillFromAddYourOwn],
  );

  const applyEditPrefill = useCallback(
    (row: RexForEditRow) => {
      reset();
      editSessionRef.current = true;
      editPrefillRef.current = row;
      place.prefillFromEditRow(row);
      setSelectedCategoryId(row.category_code);
      setSelectedSubcategoryCode(row.subcategory_code || null);
      setPhotoStoragePaths(row.photo_paths ?? []);
      scorecard.setScoreQuickTip(row.must_know ?? '');
      scorecard.setScoreReview(row.review ?? '');
      circles.prefillFromEditRow(row);
    },
    [
      reset,
      place.prefillFromEditRow,
      setSelectedCategoryId,
      setSelectedSubcategoryCode,
      scorecard.setScoreQuickTip,
      scorecard.setScoreReview,
      circles.prefillFromEditRow,
    ],
  );

  return {
    nav: {
      stepId: nav.stepId,
      stepIndex: nav.stepIndex,
      activeSteps: category.activeSteps,
      isFirstStep: nav.isFirstStep,
      isLastStep: nav.isLastStep,
      goNext: nav.goNext,
      goBack: nav.goBack,
      canProceed,
    },
    place,
    category: { ...category, autoSuggestedCategoryId },
    scorecard,
    circles,
    photos: { paths: photoStoragePaths, setPaths: setPhotoStoragePaths },
    syncFormToConfig,
    reset,
    applyAddYourOwnPrefill,
    applyEditPrefill,
  };
}
