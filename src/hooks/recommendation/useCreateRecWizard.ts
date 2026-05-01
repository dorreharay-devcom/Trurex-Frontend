import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createManualPlace, upsertGooglePlace } from '~/api/rexPlacesApi';
import { CREATE_REC_REVIEW_MAX } from '~/constants/recommendation/createScorecard';
import {
  buildSelectedSearchPlaceFromAddYourOwn,
  type AddYourOwnRecSource,
} from '~/utils/recommendation/recCreateFlow';
import {
  CREATE_REC_STEP_ORDER,
  getActiveCreateRecSteps,
  type CreateRecStepId,
  type CreateRecSearchPlace,
  type SearchEntryMode,
} from '~/types/recommendation/create';
import type {
  CategoryCreateConfig,
  CategoryRatingDimension,
  CategoryQuestion,
} from '~/types/recommendation/rexCategoryCreateConfig';
import { isStrictUuid } from '~/utils/guards';

function suggestedCategoryFromSearch(
  searchMode: SearchEntryMode,
  selectedSearchPlace: CreateRecSearchPlace | null,
): string | null {
  if (searchMode !== 'select' || !selectedSearchPlace) return null;
  const code = selectedSearchPlace.categoryCode?.trim();
  if (code) return code;
  const cid = selectedSearchPlace.categoryId?.trim();
  if (!cid || isStrictUuid(cid)) return null;
  return cid;
}

type CanProceedDeps = {
  searchMode: SearchEntryMode;
  manualName: string;
  selectedSearchPlace: CreateRecSearchPlace | null;
  selectedCategoryId: string | null;
  selectedCircleIds: Set<string>;
  selectedSubcategoryCode: string | null;
  photoStoragePaths: string[];
};

function canProceedForStep(stepId: CreateRecStepId, d: CanProceedDeps): boolean {
  switch (stepId) {
    case 'search':
      return d.searchMode === 'manual'
        ? d.manualName.trim().length > 0
        : d.selectedSearchPlace !== null;
    case 'category':
      return d.selectedCategoryId !== null;
    case 'type':
      return d.selectedSubcategoryCode !== null;
    case 'scorecard':
      return true;
    case 'photos':
      return d.photoStoragePaths.length >= 1;
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
  const categoryCodePrefillRef = useRef<string | null>(null);

  const [stepId, setStepId] = useState<CreateRecStepId>('search');
  const [searchMode, setSearchMode] = useState<SearchEntryMode>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchPlace, setSelectedSearchPlace] = useState<CreateRecSearchPlace | null>(null);
  const [linkedPlaceId, setLinkedPlaceId] = useState<string | null>(null);
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
  const [scoreValueForMoney, setScoreValueForMoney] = useState<number | null>(null);
  const [scoreReview, setScoreReview] = useState('');
  const [selectedCircleIds, setSelectedCircleIds] = useState<Set<string>>(
    () => new Set(['public']),
  );
  const [categoryHasSubcategoryStep, setCategoryHasSubcategoryStep] = useState(false);

  const syncCategoryCreateShape = useCallback((config: CategoryCreateConfig | null) => {
    setCategoryHasSubcategoryStep((config?.subcategories?.length ?? 0) > 0);
  }, []);

  const activeSteps = useMemo(
    () => getActiveCreateRecSteps(selectedCategoryId, categoryHasSubcategoryStep),
    [selectedCategoryId, categoryHasSubcategoryStep],
  );

  useEffect(() => {
    setStepId((prev) => resolveStepIdAfterStepsChange(prev, activeSteps));
  }, [activeSteps]);

  useEffect(() => {
    setSelectedSubcategoryCode(null);
    setCategoryHasSubcategoryStep(false);
  }, [selectedCategoryId]);

  const stepIndex = activeSteps.indexOf(stepId);
  const safeStepIndex = stepIndex >= 0 ? stepIndex : 0;

  const isFirstStep = stepId === 'search';
  const isLastStep = activeSteps.length > 0 && stepId === activeSteps[activeSteps.length - 1];

  const autoSuggestedCategoryId = useMemo(
    () => suggestedCategoryFromSearch(searchMode, selectedSearchPlace),
    [searchMode, selectedSearchPlace],
  );

  useEffect(() => {
    if (stepId === 'search') {
      setSelectedCategoryId(null);
    }
  }, [stepId]);

  useEffect(() => {
    if (stepId !== 'category') return;
    if (selectedCategoryId !== null) return;
    const pending = categoryCodePrefillRef.current;
    if (pending) {
      setSelectedCategoryId(pending);
      categoryCodePrefillRef.current = null;
      return;
    }
    const sug = suggestedCategoryFromSearch(searchMode, selectedSearchPlace);
    if (sug) setSelectedCategoryId(sug);
  }, [stepId, selectedCategoryId, searchMode, selectedSearchPlace]);

  const canProceed = useMemo(
    () =>
      canProceedForStep(stepId, {
        searchMode,
        manualName,
        selectedSearchPlace,
        selectedCategoryId,
        selectedCircleIds,
        selectedSubcategoryCode,
        photoStoragePaths,
      }),
    [
      stepId,
      searchMode,
      manualName,
      selectedSearchPlace,
      selectedCategoryId,
      selectedCircleIds,
      selectedSubcategoryCode,
      photoStoragePaths,
    ],
  );

  const syncFormToConfig = useCallback(
    (dimensions: CategoryRatingDimension[], _questions: CategoryQuestion[]) => {
      setCategoryRatings(Object.fromEntries(dimensions.map((d) => [d.code, null])));
      setQuestionAnswers({});
      setSelectedTagSlugs([]);
      setScoreValueForMoney(null);
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

  const selectSearchPlace = useCallback((place: CreateRecSearchPlace) => {
    setSelectedSearchPlace(place);
    setLinkedPlaceId(null);
  }, []);

  useEffect(() => {
    setLinkedPlaceId(null);
  }, [selectedCategoryId]);

  const persistPlaceForCategory = useCallback(
    async (p_category_code: string) => {
      if (linkedPlaceId) return;
      const code = p_category_code.trim();
      if (!code) {
        throw new Error('Pick a category first.');
      }
      if (searchMode === 'manual') {
        const name = manualName.trim();
        if (!name) {
          throw new Error('Enter a place name.');
        }
        const row = await createManualPlace({
          p_name: name,
          p_category_code: code,
          p_normalized_address: manualAddress.trim() || null,
          p_latitude: manualGeotag?.lat ?? null,
          p_longitude: manualGeotag?.lng ?? null,
        });
        setLinkedPlaceId(row.id);
        return;
      }
      const sel = selectedSearchPlace;
      if (!sel) {
        throw new Error('Select a place.');
      }
      if (sel.source === 'database') {
        setLinkedPlaceId(sel.id);
        return;
      }
      if (sel.source === 'google') {
        const pid = sel.providerPlaceId;
        if (!pid) {
          throw new Error('Missing Google place id.');
        }
        const row = await upsertGooglePlace({
          p_provider_place_id: pid,
          p_name: sel.title,
          p_category_code: code,
          p_normalized_address: sel.fullText ?? sel.subtitle ?? null,
          p_latitude: sel.latitude ?? null,
          p_longitude: sel.longitude ?? null,
        });
        setLinkedPlaceId(row.id);
        return;
      }
      throw new Error('Unsupported place source.');
    },
    [linkedPlaceId, searchMode, manualName, manualAddress, manualGeotag, selectedSearchPlace],
  );

  const reset = useCallback(() => {
    categoryCodePrefillRef.current = null;
    setStepId('search');
    setSearchMode('select');
    setSearchQuery('');
    setSelectedSearchPlace(null);
    setLinkedPlaceId(null);
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
    setScoreValueForMoney(null);
    setScoreReview('');
    setSelectedCircleIds(new Set(['public']));
    setCategoryHasSubcategoryStep(false);
  }, []);

  const applyAddYourOwnPrefill = useCallback(
    (source: AddYourOwnRecSource) => {
      reset();
      setSearchQuery(source.placeName);
      setSelectedSearchPlace(buildSelectedSearchPlaceFromAddYourOwn(source));
      categoryCodePrefillRef.current = source.categoryCode;
    },
    [reset],
  );

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
    setSelectedSearchPlace(null);
    setLinkedPlaceId(null);
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
    selectedSearchPlace,
    selectSearchPlace,
    linkedPlaceId,
    persistPlaceForCategory,
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
    applyAddYourOwnPrefill,
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
    scoreValueForMoney,
    setScoreValueForMoney,
    scoreReview,
    setScoreReview: setScoreReviewClamped,
    selectedCircleIds,
    toggleCircleId,
    syncCategoryCreateShape,
  };
}
