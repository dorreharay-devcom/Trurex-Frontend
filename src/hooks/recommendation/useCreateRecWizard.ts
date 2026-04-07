import { useCallback, useEffect, useMemo, useState } from 'react';
import { CREATE_REC_SEARCH_PLACES } from '~/constants/recommendation/mockSearchPlaces';
import {
  CREATE_REC_REVIEW_MAX,
  CREATE_REC_SCORE_COUNT,
} from '~/constants/recommendation/createScorecard';
import {
  CREATE_REC_STEPS,
  type CreateRecStepId,
  type SearchEntryMode,
} from '~/types/recommendation/create';

const STEP_COUNT = CREATE_REC_STEPS.length;

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
};

function canProceedForStep(stepId: CreateRecStepId, d: CanProceedDeps): boolean {
  switch (stepId) {
    case 'search':
      return d.searchMode === 'manual'
        ? d.manualName.trim().length > 0
        : d.selectedPlaceId !== null;
    case 'category':
      return d.selectedCategoryId !== null;
    case 'scorecard':
      return true;
    case 'circles':
      return d.selectedCircleIds.size > 0;
    case 'confirm':
      return true;
  }
}

export function useCreateRecWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [searchMode, setSearchMode] = useState<SearchEntryMode>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualGeotag, setManualGeotag] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [scoreStarRatings, setScoreStarRatings] = useState<number[]>(() =>
    Array(CREATE_REC_SCORE_COUNT).fill(0),
  );
  const [scoreAppliesSelected, setScoreAppliesSelected] = useState<Record<string, boolean>>({});
  const [scoreQuickTip, setScoreQuickTip] = useState('');
  const [scoreReview, setScoreReview] = useState('');
  const [selectedCircleIds, setSelectedCircleIds] = useState<Set<string>>(
    () => new Set(['public']),
  );

  const stepId = CREATE_REC_STEPS[stepIndex];

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEP_COUNT - 1;

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
      }),
    [stepId, searchMode, manualName, selectedPlaceId, selectedCategoryId, selectedCircleIds],
  );

  const reset = useCallback(() => {
    setStepIndex(0);
    setSearchMode('select');
    setSearchQuery('');
    setSelectedPlaceId(null);
    setManualName('');
    setManualAddress('');
    setManualGeotag(null);
    setSelectedCategoryId(null);
    setScoreStarRatings(Array(CREATE_REC_SCORE_COUNT).fill(0));
    setScoreAppliesSelected({});
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

  const setScoreStarAt = useCallback((index: number, value: number) => {
    setScoreStarRatings((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const toggleScoreApplies = useCallback((label: string) => {
    setScoreAppliesSelected((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, STEP_COUNT - 1));
  }, []);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

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
    stepIndex,
    stepId,
    stepIds: CREATE_REC_STEPS,
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
    autoSuggestedCategoryId,
    scoreStarRatings,
    setScoreStarAt,
    scoreAppliesSelected,
    toggleScoreApplies,
    scoreQuickTip,
    setScoreQuickTip,
    scoreReview,
    setScoreReview: setScoreReviewClamped,
    selectedCircleIds,
    toggleCircleId,
  };
}
