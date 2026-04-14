import { useCallback, useEffect, useMemo, useState } from 'react';
import { CREATE_REC_SEARCH_PLACES } from '~/constants/recommendation/mockSearchPlaces';
import { CREATE_REC_REVIEW_MAX } from '~/constants/recommendation/createScorecard';
import {
  CREATE_REC_STEP_ORDER,
  getActiveCreateRecSteps,
  type CreateRecStepId,
  type SearchEntryMode,
} from '~/types/recommendation/create';
import type {
  CategoryRatingDimension,
  CategoryQuestion,
} from '~/types/recommendation/rexCategoryCreateConfig';

function suggestedCategoryFromSearch(
  searchMode: SearchEntryMode,
  selectedPlaceId: string | null,
): string | null {
  if (searchMode !== 'select' || !selectedPlaceId) return null;
  return CREATE_REC_SEARCH_PLACES.find((p) => p.id === selectedPlaceId)?.categoryId ?? null;
}

type CanProceedDeps = {
  searchMode: SearchEntryMode;
  manualName: string;
  selectedPlaceId: string | null;
  selectedCategoryId: string | null;
  selectedCircleIds: Set<string>;
  selectedSubcategoryCode: string | null;
};

function canProceedForStep(stepId: CreateRecStepId, d: CanProceedDeps): boolean {
  switch (stepId) {
    case 'search':
      return d.searchMode === 'manual'
        ? d.manualName.trim().length > 0
        : d.selectedPlaceId !== null;
    case 'category':
      return d.selectedCategoryId !== null;
    case 'type':
      return d.selectedSubcategoryCode !== null;
    case 'scorecard':
      return true;
    case 'photos':
      return true;
    case 'circles':
      return d.selectedCircleIds.size > 0;
    case 'confirm':
      return true;
  }
}

function resolveStepIdAfterStepsChange(
  previous: CreateRecStepId,
  activeSteps: CreateRecStepId[],
): CreateRecStepId {
  if (activeSteps.includes(previous)) return previous;
  const start = CREATE_REC_STEP_ORDER.indexOf(previous);
  for (let i = Math.max(0, start); i < CREATE_REC_STEP_ORDER.length; i++) {
    const candidate = CREATE_REC_STEP_ORDER[i];
    if (activeSteps.includes(candidate)) return candidate;
  }
  return activeSteps[0] ?? 'search';
}

export function useCreateRecWizard() {
  const [stepId, setStepId] = useState<CreateRecStepId>('search');
  const [searchMode, setSearchMode] = useState<SearchEntryMode>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualGeotag, setManualGeotag] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryCode, setSelectedSubcategoryCode] = useState<string | null>(null);
  const [photoStoragePaths, setPhotoStoragePaths] = useState<string[]>([]);
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number | null>>({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<string[]>([]);
  const [scoreQuickTip, setScoreQuickTip] = useState('');
  const [scoreReview, setScoreReview] = useState('');
  const [selectedCircleIds, setSelectedCircleIds] = useState<Set<string>>(
    () => new Set(['public']),
  );
  const activeSteps = useMemo(
    () => getActiveCreateRecSteps(selectedCategoryId),
    [selectedCategoryId],
  );

  useEffect(() => {
    setStepId((prev) => resolveStepIdAfterStepsChange(prev, activeSteps));
  }, [activeSteps]);

  useEffect(() => {
    setSelectedSubcategoryCode(null);
  }, [selectedCategoryId]);

  const stepIndex = activeSteps.indexOf(stepId);
  const safeStepIndex = stepIndex >= 0 ? stepIndex : 0;

  const isFirstStep = stepId === 'search';
  const isLastStep = activeSteps.length > 0 && stepId === activeSteps[activeSteps.length - 1];

  const autoSuggestedCategoryId = useMemo(
    () => suggestedCategoryFromSearch(searchMode, selectedPlaceId),
    [searchMode, selectedPlaceId],
  );

  useEffect(() => {
    if (stepId === 'search') {
      setSelectedCategoryId(null);
    }
  }, [stepId]);

  useEffect(() => {
    if (stepId !== 'category') return;
    if (selectedCategoryId !== null) return;
    const sug = suggestedCategoryFromSearch(searchMode, selectedPlaceId);
    if (sug) setSelectedCategoryId(sug);
  }, [stepId, selectedCategoryId, searchMode, selectedPlaceId]);

  const canProceed = useMemo(
    () =>
      canProceedForStep(stepId, {
        searchMode,
        manualName,
        selectedPlaceId,
        selectedCategoryId,
        selectedCircleIds,
        selectedSubcategoryCode,
      }),
    [
      stepId,
      searchMode,
      manualName,
      selectedPlaceId,
      selectedCategoryId,
      selectedCircleIds,
      selectedSubcategoryCode,
    ],
  );

  const syncFormToConfig = useCallback(
    (dimensions: CategoryRatingDimension[], _questions: CategoryQuestion[]) => {
      setCategoryRatings(Object.fromEntries(dimensions.map((d) => [d.code, null])));
      setQuestionAnswers({});
      setSelectedTagSlugs([]);
    },
    [],
  );

  const setCategoryRating = useCallback((code: string, value: number) => {
    setCategoryRatings((prev) => ({ ...prev, [code]: value === 0 ? null : value }));
  }, []);

  const setQuestionAnswer = useCallback((code: string, optionCode: string) => {
    setQuestionAnswers((prev) => ({ ...prev, [code]: optionCode }));
  }, []);

  const toggleTagSlug = useCallback((slug: string) => {
    setSelectedTagSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }, []);

  const reset = useCallback(() => {
    setStepId('search');
    setSearchMode('select');
    setSearchQuery('');
    setSelectedPlaceId(null);
    setManualName('');
    setManualAddress('');
    setManualGeotag(null);
    setSelectedCategoryId(null);
    setSelectedSubcategoryCode(null);
    setPhotoStoragePaths([]);
    setCategoryRatings({});
    setQuestionAnswers({});
    setSelectedTagSlugs([]);
    setScoreQuickTip('');
    setScoreReview('');
    setSelectedCircleIds(new Set(['public']));
  }, []);

  const toggleCircleId = useCallback((id: string) => {
    setSelectedCircleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const setScoreReviewClamped = useCallback((text: string) => {
    setScoreReview(text.slice(0, CREATE_REC_REVIEW_MAX));
  }, []);

  const goNext = useCallback(() => {
    const idx = activeSteps.indexOf(stepId);
    if (idx < 0 || idx >= activeSteps.length - 1) return;
    setStepId(activeSteps[idx + 1]);
  }, [activeSteps, stepId]);

  const goBack = useCallback(() => {
    const idx = activeSteps.indexOf(stepId);
    if (idx <= 0) return;
    setStepId(activeSteps[idx - 1]);
  }, [activeSteps, stepId]);

  const openManual = useCallback(() => {
    setSearchMode('manual');
    setSelectedPlaceId(null);
  }, []);

  const backToSearchSelect = useCallback(() => {
    setSearchMode('select');
    setManualName('');
    setManualAddress('');
    setManualGeotag(null);
  }, []);

  return {
    stepId,
    stepIndex: safeStepIndex,
    activeSteps,
    searchMode,
    searchQuery,
    setSearchQuery,
    selectedPlaceId,
    setSelectedPlaceId,
    manualName,
    setManualName,
    manualAddress,
    setManualAddress,
    manualGeotag,
    setManualGeotag,
    setSearchMode,
    isFirstStep,
    isLastStep,
    canProceed,
    canContinue: canProceed,
    reset,
    goNext,
    goBack,
    openManual,
    backToSearchSelect,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubcategoryCode,
    setSelectedSubcategoryCode,
    photoStoragePaths,
    setPhotoStoragePaths,
    autoSuggestedCategoryId,
    categoryRatings,
    setCategoryRating,
    questionAnswers,
    setQuestionAnswer,
    selectedTagSlugs,
    toggleTagSlug,
    syncFormToConfig,
    scoreQuickTip,
    setScoreQuickTip,
    scoreReview,
    setScoreReview: setScoreReviewClamped,
    selectedCircleIds,
    toggleCircleId,
  };
}
