import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createManualPlace, upsertGooglePlace } from '~/api/rexPlacesApi';
import {
  CREATE_REC_MUST_KNOW_MAX,
  CREATE_REC_REVIEW_MAX,
} from '~/constants/recommendation/createScorecard';
import {
  buildSelectedSearchPlaceFromAddYourOwn,
  keepKnownCircleIds,
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
import type { RexForEditRow } from '~/types/recommendation/rexDetail';
import type { CreateRecCircle } from '~/constants/recommendation/createCircles';
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
  manualAddress: string;
  manualGeotag: { lat: number; lng: number } | null;
  onlineName: string;
  selectedSearchPlace: CreateRecSearchPlace | null;
  selectedCategoryId: string | null;
  selectedCircleIds: Set<string>;
  privateRex: boolean;
  selectedSubcategoryCode: string | null;
  photoStoragePaths: string[];
};

function canProceedForStep(stepId: CreateRecStepId, d: CanProceedDeps): boolean {
  switch (stepId) {
    case 'search':
      if (d.searchMode === 'online') {
        return d.onlineName.trim().length > 0;
      }
      if (d.searchMode === 'manual') {
        return (
          d.manualName.trim().length > 0 &&
          d.manualAddress.trim().length > 0 &&
          d.manualGeotag != null
        );
      }
      return d.selectedSearchPlace !== null;
    case 'category':
      return d.selectedCategoryId !== null;
    case 'type':
      return d.selectedSubcategoryCode !== null;
    case 'scorecard':
      return true;
    case 'photos':
      return true;
    case 'circles':
      return d.privateRex || d.selectedCircleIds.size > 0;
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
  const editPrefillRef = useRef<RexForEditRow | null>(null);
  const editSessionRef = useRef(false);

  const [stepId, setStepId] = useState<CreateRecStepId>('search');
  const [searchMode, setSearchMode] = useState<SearchEntryMode>('select');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchPlace, setSelectedSearchPlace] = useState<CreateRecSearchPlace | null>(null);
  const [linkedPlaceId, setLinkedPlaceId] = useState<string | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualAddress, setManualAddress] = useState('');
  const [manualGeotag, setManualGeotag] = useState<{ lat: number; lng: number } | null>(null);
  const [onlineName, setOnlineName] = useState('');
  const [onlineWebsiteUrl, setOnlineWebsiteUrl] = useState('');
  const [onlineLocationText, setOnlineLocationTextState] = useState('');
  const [onlineGeotag, setOnlineGeotag] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryCode, setSelectedSubcategoryCode] = useState<string | null>(null);
  const [photoStoragePaths, setPhotoStoragePaths] = useState<string[]>([]);
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number | null>>({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [selectedTagSlugs, setSelectedTagSlugs] = useState<string[]>([]);
  const [scoreQuickTip, setScoreQuickTip] = useState('');
  const [scoreValueForMoney, setScoreValueForMoney] = useState<number | null>(null);
  const [scoreReview, setScoreReview] = useState('');
  const [selectedCircleIds, setSelectedCircleIds] = useState<Set<string>>(() => new Set());
  const [publicCircleId, setPublicCircleId] = useState<string | null>(null);
  const [privateRex, setPrivateRex] = useState(false);
  const [categoryHasSubcategoryStep, setCategoryHasSubcategoryStep] = useState(false);

  const syncCategoryCreateShape = useCallback((config: CategoryCreateConfig | null) => {
    setCategoryHasSubcategoryStep((config?.subcategories?.length ?? 0) > 0);
  }, []);

  const activeSteps = useMemo(
    () => getActiveCreateRecSteps(selectedCategoryId, categoryHasSubcategoryStep),
    [selectedCategoryId, categoryHasSubcategoryStep],
  );

  const clearScorecardState = useCallback(() => {
    setCategoryRatings({});
    setQuestionAnswers({});
    setSelectedTagSlugs([]);
    setScoreQuickTip('');
    setScoreValueForMoney(null);
    setScoreReview('');
  }, []);

  useEffect(() => {
    setStepId((prev) => resolveStepIdAfterStepsChange(prev, activeSteps));
  }, [activeSteps]);

  useEffect(() => {
    if (editPrefillRef.current?.category_code === selectedCategoryId) {
      setCategoryHasSubcategoryStep(false);
      return;
    }
    editPrefillRef.current = null;
    setSelectedSubcategoryCode(null);
    setCategoryHasSubcategoryStep(false);
    clearScorecardState();
  }, [clearScorecardState, selectedCategoryId]);

  const stepIndex = activeSteps.indexOf(stepId);
  const safeStepIndex = stepIndex >= 0 ? stepIndex : 0;

  const isFirstStep = stepId === 'search';
  const isLastStep = activeSteps.length > 0 && stepId === activeSteps[activeSteps.length - 1];

  const autoSuggestedCategoryId = useMemo(
    () => suggestedCategoryFromSearch(searchMode, selectedSearchPlace),
    [searchMode, selectedSearchPlace],
  );

  useEffect(() => {
    if (stepId === 'search' && !editSessionRef.current) {
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
        manualAddress,
        manualGeotag,
        onlineName,
        selectedSearchPlace,
        selectedCategoryId,
        selectedCircleIds,
        privateRex,
        selectedSubcategoryCode,
        photoStoragePaths,
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
      photoStoragePaths,
    ],
  );

  const syncFormToConfig = useCallback(
    (dimensions: CategoryRatingDimension[], _questions: CategoryQuestion[]) => {
      const edit =
        editPrefillRef.current?.category_code === selectedCategoryId
          ? editPrefillRef.current
          : null;
      setCategoryRatings(
        Object.fromEntries(
          dimensions.map((d) => [d.code, edit?.category_ratings?.[d.code]?.score ?? null]),
        ),
      );
      setQuestionAnswers(edit?.question_answers ?? {});
      setSelectedTagSlugs(edit?.tag_slugs ?? []);
      setScoreValueForMoney(edit?.score_value_for_money ?? null);
      if (edit) editPrefillRef.current = null;
    },
    [selectedCategoryId],
  );

  const setCategoryRating = useCallback((code: string, value: number) => {
    setCategoryRatings((prev) => ({ ...prev, [code]: value === 0 ? null : value }));
  }, []);

  const setQuestionAnswer = useCallback((code: string, optionCode: string) => {
    setQuestionAnswers((prev) => {
      if (prev[code] === optionCode) {
        const { [code]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [code]: optionCode };
    });
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

  const setManualAddressValue = useCallback((value: string) => {
    setManualAddress(value);
    setManualGeotag(null);
  }, []);

  const setOnlineLocationTextValue = useCallback((value: string) => {
    setOnlineLocationTextState(value);
    setOnlineGeotag(null);
  }, []);

  const applyOnlineGeotag = useCallback((result: { lat: number; lng: number; addressLabel: string }) => {
    setOnlineLocationTextState(result.addressLabel);
    setOnlineGeotag({ lat: result.lat, lng: result.lng });
  }, []);

  const selectManualAddress = useCallback((place: CreateRecSearchPlace) => {
    setManualAddress(place.fullText ?? place.subtitle ?? place.title);
    setManualGeotag(
      place.latitude != null && place.longitude != null
        ? { lat: place.latitude, lng: place.longitude }
        : null,
    );
  }, []);

  useEffect(() => {
    setLinkedPlaceId(null);
  }, [selectedCategoryId]);

  const persistPlaceForCategory = useCallback(
    async (p_category_code: string) => {
      if (linkedPlaceId) return;
      if (searchMode === 'online') return;
      const code = p_category_code.trim();
      if (!code) {
        throw new Error('Pick a category first.');
      }
      if (searchMode === 'manual') {
        const name = manualName.trim();
        if (!name) {
          throw new Error('Enter a place name.');
        }
        const address = manualAddress.trim();
        if (!address) {
          throw new Error('Choose an address or tag your current location.');
        }
        if (!manualGeotag) {
          throw new Error('Choose a valid address from suggestions or tag your current location.');
        }
        const row = await createManualPlace({
          p_name: name,
          p_category_code: code,
          p_normalized_address: address,
          p_latitude: manualGeotag.lat,
          p_longitude: manualGeotag.lng,
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
    editPrefillRef.current = null;
    editSessionRef.current = false;
    setStepId('search');
    setSearchMode('select');
    setSearchQuery('');
    setSelectedSearchPlace(null);
    setLinkedPlaceId(null);
    setManualName('');
    setManualAddress('');
    setManualGeotag(null);
    setOnlineName('');
    setOnlineWebsiteUrl('');
    setOnlineLocationTextState('');
    setOnlineGeotag(null);
    setSelectedCategoryId(null);
    setSelectedSubcategoryCode(null);
    setPhotoStoragePaths([]);
    setCategoryRatings({});
    setQuestionAnswers({});
    setSelectedTagSlugs([]);
    setScoreQuickTip('');
    setScoreValueForMoney(null);
    setScoreReview('');
    setSelectedCircleIds(new Set());
    setPublicCircleId(null);
    setPrivateRex(false);
    setCategoryHasSubcategoryStep(false);
  }, []);

  const ensureDefaultCircleSelectionFromApiOrder = useCallback((rows: CreateRecCircle[]) => {
    if (!rows.length) return;
    const outerId = rows[rows.length - 1]!.id;
    const knownIds = new Set(rows.map((r) => r.id));
    setPublicCircleId(outerId);
    setSelectedCircleIds((prev) => {
      const kept = keepKnownCircleIds(prev, knownIds);
      if (kept.has('public')) {
        const next = new Set(kept);
        next.delete('public');
        next.add(outerId);
        return next;
      }
      if (kept.size === 0) return new Set([outerId]);
      return kept;
    });
  }, []);

  const applyAddYourOwnPrefill = useCallback(
    (source: AddYourOwnRecSource) => {
      reset();
      if (source.isOnlinePlace) {
        setSearchMode('online');
        setOnlineName(source.placeName);
        setOnlineWebsiteUrl(source.placeWebsiteUrl ?? '');
      } else {
        setSearchQuery(source.placeName);
        setSelectedSearchPlace(buildSelectedSearchPlaceFromAddYourOwn(source));
      }
      categoryCodePrefillRef.current = source.categoryCode;
    },
    [reset],
  );

  const applyEditPrefill = useCallback(
    (row: RexForEditRow) => {
      reset();
      editSessionRef.current = true;
      editPrefillRef.current = row;
      if (row.is_online_place) {
        setSearchMode('online');
        setOnlineName(row.place_name ?? '');
        setOnlineWebsiteUrl(row.place_website_url ?? '');
        setOnlineLocationTextState(row.location_text ?? '');
        setOnlineGeotag(null);
      } else {
        setSearchMode('select');
        setSearchQuery(row.place_name ?? '');
        setSelectedSearchPlace({
          id: row.place_id ?? row.id,
          source: 'database',
          title: row.place_name ?? '',
          subtitle: '',
          categoryLabel: '',
          categoryId: row.category_code,
          categoryCode: row.category_code,
          fullText: undefined,
        });
        setLinkedPlaceId(row.place_id);
      }
      setSelectedCategoryId(row.category_code);
      setSelectedSubcategoryCode(row.subcategory_code || null);
      setPhotoStoragePaths(row.photo_paths ?? []);
      setScoreQuickTip((row.must_know ?? '').slice(0, CREATE_REC_MUST_KNOW_MAX));
      setScoreReview((row.review ?? '').slice(0, CREATE_REC_REVIEW_MAX));
      setSelectedCircleIds(new Set(row.visibility === 'circles' ? row.circle_ids : []));
      setPrivateRex(row.visibility === 'private');
    },
    [reset],
  );

  const toggleCircleId = useCallback(
    (id: string) => {
      setSelectedCircleIds((prev) => {
        if (id === 'public' || id === publicCircleId) {
          return prev.has(id) ? new Set() : new Set([id]);
        }
        const next = new Set(prev);
        next.delete('public');
        if (publicCircleId) next.delete(publicCircleId);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [publicCircleId],
  );

  const setPrivateRexSelection = useCallback((selected: boolean) => {
    setPrivateRex(selected);
    if (selected) setSelectedCircleIds(new Set());
  }, []);

  const setScoreReviewClamped = useCallback((text: string) => {
    setScoreReview(text.slice(0, CREATE_REC_REVIEW_MAX));
  }, []);

  const setScoreQuickTipClamped = useCallback((text: string) => {
    setScoreQuickTip(text.slice(0, CREATE_REC_MUST_KNOW_MAX));
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

  const setOnlinePlaceSelected = useCallback((selected: boolean) => {
    setSearchMode(selected ? 'online' : 'select');
    setSearchQuery('');
    setSelectedSearchPlace(null);
    setLinkedPlaceId(null);
    setManualAddress('');
    setManualGeotag(null);
    if (!selected) {
      setOnlineName('');
      setOnlineWebsiteUrl('');
      setOnlineLocationTextState('');
      setOnlineGeotag(null);
    }
  }, []);

  const backToSearchSelect = useCallback(() => {
    setSearchMode('select');
    setManualName('');
    setManualAddress('');
    setManualGeotag(null);
    setOnlineName('');
    setOnlineWebsiteUrl('');
    setOnlineLocationTextState('');
    setOnlineGeotag(null);
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
    setManualAddress: setManualAddressValue,
    manualGeotag,
    setManualGeotag,
    onlineName,
    setOnlineName,
    onlineWebsiteUrl,
    setOnlineWebsiteUrl,
    onlineLocationText,
    setOnlineLocationText: setOnlineLocationTextValue,
    onlineGeotag,
    applyOnlineGeotag,
    setOnlinePlaceSelected,
    selectManualAddress,
    setSearchMode,
    isFirstStep,
    isLastStep,
    canProceed,
    canContinue: canProceed,
    reset,
    applyAddYourOwnPrefill,
    applyEditPrefill,
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
    setScoreQuickTip: setScoreQuickTipClamped,
    scoreValueForMoney,
    setScoreValueForMoney,
    scoreReview,
    setScoreReview: setScoreReviewClamped,
    selectedCircleIds,
    publicCircleId,
    privateRex,
    setPrivateRex: setPrivateRexSelection,
    toggleCircleId,
    ensureDefaultCircleSelectionFromApiOrder,
    syncCategoryCreateShape,
  };
}
