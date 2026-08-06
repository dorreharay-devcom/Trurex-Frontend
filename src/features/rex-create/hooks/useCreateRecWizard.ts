import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import { canProceedForStep, suggestedCategoryFromSearch } from '~/features/rex-create/lib/steps';
import { useCategorySelection } from '~/features/rex-create/hooks/wizard/useCategorySelection';
import { usePlaceSearch } from '~/features/rex-create/hooks/wizard/usePlaceSearch';
import { useScorecard } from '~/features/rex-create/hooks/wizard/useScorecard';
import { useShareCircles } from '~/features/rex-create/hooks/wizard/useShareCircles';
import { useStepNavigation } from '~/features/rex-create/hooks/wizard/useStepNavigation';
import { STEP_ID } from '~/features/rex-create/types/create';
import type { CategoryRatingDimension } from '~/features/rex-create/types/categoryCreateConfig';
import type { RexForEditRow } from '~/features/rex-detail/types/rexDetail';

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

  const {
    selectedCategoryId,
    setSelectedCategoryId,
    setSelectedSubcategoryCode,
    setHasSubcategoryStep,
    reset: resetCategory,
    selectedSubcategoryCode,
    activeSteps,
  } = category;
  const {
    clearLinkedPlace,
    searchMode,
    selectedSearchPlace,
    manualName,
    manualAddress,
    manualGeotag,
    onlineName,
    reset: resetPlace,
    prefillFromAddYourOwn,
    prefillFromEditRow: prefillPlaceFromEditRow,
  } = place;
  const { clear: clearScorecard, syncToConfig, setScoreQuickTip, setScoreReview } = scorecard;
  const {
    selectedCircleIds,
    privateRex,
    reset: resetCircles,
    prefillFromEditRow: prefillCirclesFromEditRow,
  } = circles;
  const { stepId, reset: resetNav, stepIndex, isFirstStep, isLastStep, goNext, goBack } = nav;

  useEffect(() => {
    if (editPrefillRef.current?.category_code === selectedCategoryId) {
      setHasSubcategoryStep(false);
      return;
    }
    editPrefillRef.current = null;
    setSelectedSubcategoryCode(null);
    setHasSubcategoryStep(false);
    clearScorecard();
  }, [selectedCategoryId, setSelectedSubcategoryCode, setHasSubcategoryStep, clearScorecard]);

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
    const sug = suggestedCategoryFromSearch(searchMode, selectedSearchPlace);
    if (sug) setSelectedCategoryId(sug);
  }, [stepId, selectedCategoryId, setSelectedCategoryId, searchMode, selectedSearchPlace]);

  const autoSuggestedCategoryId = useMemo(
    () => suggestedCategoryFromSearch(searchMode, selectedSearchPlace),
    [searchMode, selectedSearchPlace],
  );

  const canProceed = useMemo(
    () =>
      canProceedForStep(stepId, {
        searchMode,
        manualName,
        manualAddress,
        manualGeotag,
        onlineName,
        selectedSearchPlace,
        selectedCategoryId,
        selectedCircleIds,
        privateRex,
        selectedSubcategoryCode,
      }),
    [
      stepId,
      searchMode,
      manualName,
      manualAddress,
      manualGeotag,
      onlineName,
      selectedSearchPlace,
      selectedCategoryId,
      selectedCircleIds,
      privateRex,
      selectedSubcategoryCode,
    ],
  );

  const syncFormToConfig = useCallback(
    (dimensions: CategoryRatingDimension[]) => {
      const edit =
        editPrefillRef.current?.category_code === selectedCategoryId
          ? editPrefillRef.current
          : null;
      syncToConfig(dimensions, edit);
      if (edit) editPrefillRef.current = null;
    },
    [selectedCategoryId, syncToConfig],
  );

  const resetForms = useCallback(() => {
    categoryCodePrefillRef.current = null;
    editPrefillRef.current = null;
    editSessionRef.current = false;
    resetPlace();
    resetCategory();
    clearScorecard();
    resetCircles();
    setPhotoStoragePaths([]);
  }, [resetPlace, resetCategory, clearScorecard, resetCircles]);

  const reset = useCallback(() => {
    resetForms();
    resetNav();
  }, [resetForms, resetNav]);

  const applyAddYourOwnPrefill = useCallback(
    (source: AddYourOwnRecSource) => {
      reset();
      prefillFromAddYourOwn(source);
      categoryCodePrefillRef.current = source.categoryCode;
    },
    [reset, prefillFromAddYourOwn],
  );

  const applyEditPrefill = useCallback(
    (row: RexForEditRow) => {
      reset();
      editSessionRef.current = true;
      editPrefillRef.current = row;
      prefillPlaceFromEditRow(row);
      setSelectedCategoryId(row.category_code);
      setSelectedSubcategoryCode(row.subcategory_code || null);
      setPhotoStoragePaths(row.photo_paths ?? []);
      setScoreQuickTip(row.must_know ?? '');
      setScoreReview(row.review ?? '');
      prefillCirclesFromEditRow(row);
    },
    [
      reset,
      prefillPlaceFromEditRow,
      setSelectedCategoryId,
      setSelectedSubcategoryCode,
      setScoreQuickTip,
      setScoreReview,
      prefillCirclesFromEditRow,
    ],
  );

  return {
    nav: {
      stepId,
      stepIndex,
      activeSteps,
      isFirstStep,
      isLastStep,
      goNext,
      goBack,
      reset: resetNav,
      canProceed,
    },
    place,
    category: { ...category, autoSuggestedCategoryId },
    scorecard,
    circles,
    photos: { paths: photoStoragePaths, setPaths: setPhotoStoragePaths },
    syncFormToConfig,
    reset,
    resetForms,
    applyAddYourOwnPrefill,
    applyEditPrefill,
  };
}
