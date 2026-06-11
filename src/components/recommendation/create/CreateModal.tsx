import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ChevronRight, X } from 'lucide-react-native';
import { CREATE_REC_MODAL_MAX_W } from '~/constants/recommendation/createLayout';
import { getRexCategoryApiCode } from '~/constants/recommendation/rexCategories';
import { OverlayModal } from '~/components/common/OverlayModal';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { Theme } from '~/theme/Theme';
import {
  useCreateRecWizard,
  useCreateRecommendationModalPresentation,
} from '~/hooks/recommendation';
import type { AddYourOwnRecSource } from '~/utils/recommendation/recCreateFlow';
import {
  useManualPlaceGeotag,
  type ManualPlaceGeotagResult,
} from '~/hooks/location/useManualPlaceGeotag';
import {
  fetchAllCategoryCreateConfigs,
  fetchCategoryCreateConfig,
  createRex,
  fetchRexForEdit,
  updateRex,
  discardDraftRexData,
} from '~/api/rexCreateApi';
import {
  mergeRatingDimensions,
  mergeQuestions,
  mergeTagOptions,
  categoryRatingDimensionsOnly,
  subcategoryRatingDimensionsOnly,
  categoryQuestionsOnly,
  subcategoryQuestionsOnly,
  buildCategoryRatingsPayload,
  getLinkedPlaceId,
  getPlaceNameForRex,
  hasNonPublicMockCircleSelection,
  resolveCreateRexCircleIds,
  resolveCreateRexVisibility,
} from '~/utils/recommendation/recCreateFlow';
import { toastError, toastInfo, toastSuccess } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { isWeb, unknownErrorMessage } from '~/utils';
import { cn } from '~/utils/general';
import { CreateWizardStepper } from './CreateWizardStepper';
import { CreateModalBody } from './CreateModalBody';

const DYNO_IMAGE_SOURCE = require('../../../../assets/dyno.svg');

type Props = {
  visible: boolean;
  onClose: () => void;
  addYourOwnPrefill?: AddYourOwnRecSource | null;
  editRexId?: string | null;
};

export const CreateModal: React.FC<Props> = ({
  visible,
  onClose,
  addYourOwnPrefill = null,
  editRexId = null,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const queryClient = useQueryClient();
  const flow = useCreateRecWizard();
  const {
    reset,
    applyAddYourOwnPrefill,
    applyEditPrefill,
    setManualGeotag,
    setManualAddress,
    syncFormToConfig,
    syncCategoryCreateShape,
  } = flow;
  const [submitting, setSubmitting] = useState(false);
  const postedSuccessfullyRef = useRef(false);
  const appliedEditIdRef = useRef<string | null>(null);
  const isEditMode = editRexId != null;

  useEffect(() => {
    if (visible) postedSuccessfullyRef.current = false;
  }, [visible]);

  useEffect(() => {
    if (!visible) appliedEditIdRef.current = null;
  }, [visible, editRexId]);

  const applyManualGeotag = useCallback(
    (result: ManualPlaceGeotagResult) => {
      setManualAddress(result.addressLabel);
      setManualGeotag({ lat: result.lat, lng: result.lng });
    },
    [setManualGeotag, setManualAddress],
  );

  const { isGeotagging, geotag: handleTagLocation } = useManualPlaceGeotag({
    onSuccess: applyManualGeotag,
  });

  const { sheetTranslateY, stepOpacity, handleClose } = useCreateRecommendationModalPresentation({
    visible,
    windowHeight,
    stepIndex: flow.stepIndex,
    onClose,
    reset,
  });

  useLayoutEffect(() => {
    if (!visible || !addYourOwnPrefill) return;
    applyAddYourOwnPrefill(addYourOwnPrefill);
  }, [visible, addYourOwnPrefill, applyAddYourOwnPrefill]);

  const {
    data: editRow,
    isLoading: editLoading,
    isError: editLoadError,
  } = useQuery({
    queryKey: ['rexForEdit', editRexId],
    queryFn: () => fetchRexForEdit(editRexId!),
    enabled: visible && editRexId != null,
    staleTime: 0,
  });

  useLayoutEffect(() => {
    if (!visible || !editRow || appliedEditIdRef.current === editRow.id) return;
    applyEditPrefill(editRow);
    appliedEditIdRef.current = editRow.id;
  }, [visible, editRow, applyEditPrefill]);

  useEffect(() => {
    if (!visible || !editLoadError) return;
    toastError('Could not load Rex', 'This Rex may no longer be editable.');
  }, [visible, editLoadError]);

  const abandonDraftAndClose = useCallback(() => {
    handleClose();
    if (!postedSuccessfullyRef.current) {
      void discardDraftRexData().catch(() => {});
    }
  }, [handleClose]);

  const categoryApiCode = getRexCategoryApiCode(flow.selectedCategoryId);

  const {
    data: configsByCode,
    isLoading: configsLoading,
    isFetched: configsFetched,
  } = useQuery({
    queryKey: ['rexAllCategoryCreateConfigs'],
    queryFn: async () => {
      const list = await fetchAllCategoryCreateConfigs();
      return new Map(list.map((c) => [c.code, c]));
    },
    enabled: visible,
    staleTime: 5 * 60 * 1000,
  });

  const needsSingleConfig =
    visible &&
    !!categoryApiCode &&
    configsFetched &&
    configsByCode !== undefined &&
    !configsByCode.has(categoryApiCode);

  const { data: fetchedSingleConfig } = useQuery({
    queryKey: ['rexCategoryCreateConfig', categoryApiCode],
    queryFn: () => fetchCategoryCreateConfig(categoryApiCode!),
    enabled: needsSingleConfig,
  });

  const activeCreateConfig = useMemo(() => {
    if (!categoryApiCode) return null;
    if (configsByCode?.has(categoryApiCode)) return configsByCode.get(categoryApiCode)!;
    return fetchedSingleConfig ?? null;
  }, [categoryApiCode, configsByCode, fetchedSingleConfig]);

  const categoryDefinesSubcategories = Boolean(activeCreateConfig?.subcategories?.length);

  const subcategoryCodeForMerge = useMemo(() => {
    if (!categoryDefinesSubcategories) return null;
    return flow.selectedSubcategoryCode;
  }, [categoryDefinesSubcategories, flow.selectedSubcategoryCode]);

  const mergedRatingDimensions = useMemo(
    () =>
      activeCreateConfig ? mergeRatingDimensions(activeCreateConfig, subcategoryCodeForMerge) : [],
    [activeCreateConfig, subcategoryCodeForMerge],
  );

  const mergedQuestions = useMemo(
    () => (activeCreateConfig ? mergeQuestions(activeCreateConfig, subcategoryCodeForMerge) : []),
    [activeCreateConfig, subcategoryCodeForMerge],
  );

  const mergedTagOptions = useMemo(
    () => (activeCreateConfig ? mergeTagOptions(activeCreateConfig, subcategoryCodeForMerge) : []),
    [activeCreateConfig, subcategoryCodeForMerge],
  );

  const categoryDimsOnly = useMemo(
    () => (activeCreateConfig ? categoryRatingDimensionsOnly(activeCreateConfig) : []),
    [activeCreateConfig],
  );

  const subDimsOnly = useMemo(
    () =>
      activeCreateConfig
        ? subcategoryRatingDimensionsOnly(activeCreateConfig, subcategoryCodeForMerge)
        : [],
    [activeCreateConfig, subcategoryCodeForMerge],
  );

  const categoryQsOnly = useMemo(
    () => (activeCreateConfig ? categoryQuestionsOnly(activeCreateConfig) : []),
    [activeCreateConfig],
  );

  const subQsOnly = useMemo(
    () =>
      activeCreateConfig
        ? subcategoryQuestionsOnly(activeCreateConfig, subcategoryCodeForMerge)
        : [],
    [activeCreateConfig, subcategoryCodeForMerge],
  );

  const subcategoryLabelForConfirm = useMemo(() => {
    if (!flow.selectedSubcategoryCode || !activeCreateConfig) return null;
    return (
      activeCreateConfig.subcategories.find((s) => s.code === flow.selectedSubcategoryCode)
        ?.display_name ?? null
    );
  }, [activeCreateConfig, flow.selectedSubcategoryCode]);

  const showQuickTip = mergedTagOptions.length > 0;
  const useExperienceReviewCopy = categoryDefinesSubcategories;

  const ratingDimCodesKey = mergedRatingDimensions.map((d) => d.code).join('|');
  const questionCodesKey = mergedQuestions.map((q) => q.code).join('|');

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!activeCreateConfig) return;
    const dims = mergeRatingDimensions(activeCreateConfig, subcategoryCodeForMerge);
    const qs = mergeQuestions(activeCreateConfig, subcategoryCodeForMerge);
    syncFormToConfig(dims, qs);
  }, [
    activeCreateConfig?.code,
    subcategoryCodeForMerge,
    ratingDimCodesKey,
    questionCodesKey,
    syncFormToConfig,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    syncCategoryCreateShape(activeCreateConfig);
  }, [activeCreateConfig, syncCategoryCreateShape]);

  const configLoading =
    Boolean(visible && flow.selectedCategoryId && categoryApiCode) &&
    (configsLoading || (needsSingleConfig && fetchedSingleConfig === undefined));

  const handlePrimaryFooter = useCallback(async () => {
    if (!flow.isLastStep) {
      if (flow.stepId === 'search') {
        flow.goNext();
        return;
      }
      if (flow.stepId === 'category') {
        const code = getRexCategoryApiCode(flow.selectedCategoryId);
        if (!code) {
          toastError('Category', 'Choose a category to continue.');
          return;
        }
        setSubmitting(true);
        try {
          await flow.persistPlaceForCategory(code);
          flow.goNext();
        } catch (e) {
          if (didAccountFrozenMutationToast(e)) return;
          toastError('Place', unknownErrorMessage(e, 'Could not save this place. Try again.'));
        } finally {
          setSubmitting(false);
        }
        return;
      }
      flow.goNext();
      return;
    }
    if (!categoryApiCode || !activeCreateConfig) {
      toastError(
        'Category unavailable',
        'Could not load category configuration. Check your connection and try again, or pick another category.',
      );
      return;
    }
    for (const q of mergedQuestions) {
      if (q.is_required) {
        const v = flow.questionAnswers[q.code];
        if (v == null || v === '') {
          toastInfo('Almost there', `Please answer: ${q.display_label}`);
          return;
        }
      }
    }
    if (
      !flow.privateRex &&
      hasNonPublicMockCircleSelection(flow.selectedCircleIds, flow.publicCircleId)
    ) {
      toastInfo(
        'Circles',
        'Sharing to named circles requires account circle IDs from the server. Select Public only for now, or wire circle loading.',
      );
      return;
    }
    setSubmitting(true);
    try {
      const p_visibility = resolveCreateRexVisibility(
        flow.selectedCircleIds,
        flow.privateRex,
        flow.publicCircleId,
      );
      const circle_ids =
        p_visibility === 'circles'
          ? resolveCreateRexCircleIds(flow.selectedCircleIds, flow.publicCircleId)
          : null;
      const p_question_answers: Record<string, string> = {};
      for (const q of mergedQuestions) {
        const v = flow.questionAnswers[q.code];
        if (v != null && v !== '') p_question_answers[q.code] = v;
        else if (q.is_required) {
          throw new Error(`Please answer: ${q.display_label}`);
        }
      }

      const params = {
        p_category_code: categoryApiCode,
        p_place_name: getPlaceNameForRex(
          flow.searchMode,
          flow.selectedSearchPlace,
          flow.manualName,
          flow.onlineName,
        ),
        p_review: flow.scoreReview.trim() || null,
        p_must_know: showQuickTip ? flow.scoreQuickTip.trim() || null : null,
        p_visibility,
        circle_ids: p_visibility === 'circles' ? circle_ids : undefined,
        tag_names: flow.selectedTagSlugs,
        photo_paths: flow.photoStoragePaths.length > 0 ? flow.photoStoragePaths : null,
        p_linked_place_id:
          flow.searchMode === 'online' ? null : (getLinkedPlaceId(flow.linkedPlaceId) ?? undefined),
        p_is_online_place: flow.searchMode === 'online',
        p_place_website_url:
          flow.searchMode === 'online' ? flow.onlineWebsiteUrl.trim() || null : null,
        p_category_ratings: buildCategoryRatingsPayload(flow.categoryRatings),
        p_question_answers: p_question_answers,
        p_score_value_for_money:
          flow.scoreValueForMoney != null && flow.scoreValueForMoney > 0
            ? flow.scoreValueForMoney
            : null,
        ...(subcategoryCodeForMerge ? { p_subcategory_code: subcategoryCodeForMerge } : {}),
      };

      if (isEditMode) {
        await updateRex({
          ...params,
          p_rex_id: editRexId,
        });
      } else {
        await createRex(params);
      }
      postedSuccessfullyRef.current = true;
      toastSuccess(
        isEditMode ? 'Updated' : 'Posted',
        isEditMode ? 'Your Rex was updated.' : 'Your recommendation is live.',
      );
      queryClient.invalidateQueries({ queryKey: ['discover-recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['search-rexes'] });
      queryClient.invalidateQueries({ queryKey: ['my-rexes'] });
      queryClient.invalidateQueries({ queryKey: ['my-saved-rexes'] });
      queryClient.invalidateQueries({ queryKey: ['collection-detail'] });
      queryClient.invalidateQueries({ queryKey: ['mapRexesInBounds'] });
      queryClient.invalidateQueries({ queryKey: ['mapRexPins'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ['rexDetail', editRexId] });
        queryClient.invalidateQueries({ queryKey: ['rexForEdit', editRexId] });
      }
      handleClose();
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError(
        isEditMode ? 'Could not update' : 'Could not post',
        unknownErrorMessage(e, 'Something went wrong.'),
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    flow,
    categoryApiCode,
    activeCreateConfig,
    mergedQuestions,
    subcategoryCodeForMerge,
    handleClose,
    showQuickTip,
    queryClient,
    isEditMode,
    editRexId,
  ]);

  const { layout } = modalConfig;

  const primaryDisabled =
    submitting ||
    editLoading ||
    isGeotagging ||
    (!flow.isLastStep && !flow.canProceed) ||
    (flow.isLastStep && submitting);

  return (
    <OverlayModal
      visible={visible}
      onRequestClose={abandonDraftAndClose}
      contentTranslateY={sheetTranslateY}
      backdropBackground={layout.backdropBackground}
    >
      <View className="flex-1 min-h-0 flex-col">
        <View className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur px-4 py-4 sm:px-6">
          <View className="flex-row items-center">
            <View className="w-[72px] items-start justify-center">
              <Pressable
                onPress={flow.isFirstStep ? abandonDraftAndClose : flow.goBack}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={flow.isFirstStep ? 'Cancel' : 'Back'}
                className="flex-row items-center gap-1.5 rounded-lg py-0.5 active:opacity-80"
              >
                <ArrowLeft size={20} color={Theme.colors.secondaryText} />
                <Text className="text-sm font-medium text-foreground">
                  {flow.isFirstStep ? 'Cancel' : 'Back'}
                </Text>
              </Pressable>
            </View>
            <Text className="min-w-0 flex-1 text-center text-lg font-display font-semibold text-foreground">
              {isEditMode ? 'Edit Rex' : 'New Rex'}
            </Text>
            <View className="w-[72px] items-end justify-center">
              {!flow.isFirstStep ? (
                <Pressable
                  onPress={abandonDraftAndClose}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Cancel and discard draft"
                  className="rounded-lg p-0.5 active:opacity-80"
                >
                  <X size={22} color={Theme.colors.secondaryText} strokeWidth={2.25} />
                </Pressable>
              ) : null}
            </View>
          </View>

          <CreateWizardStepper steps={flow.activeSteps} currentIndex={flow.stepIndex} />
        </View>

        <CreateModalBody
          visible={visible}
          flow={flow}
          stepOpacity={stepOpacity}
          onTagLocation={handleTagLocation}
          tagLocationLoading={isGeotagging}
          activeCreateConfig={activeCreateConfig}
          configLoading={configLoading}
          mergedTagOptions={mergedTagOptions}
          categoryDimsOnly={categoryDimsOnly}
          subDimsOnly={subDimsOnly}
          categoryQsOnly={categoryQsOnly}
          subQsOnly={subQsOnly}
          subcategoryStarTitle={subcategoryLabelForConfirm}
          showQuickTip={showQuickTip}
          useExperienceReviewCopy={useExperienceReviewCopy}
          subcategoryLabelForConfirm={subcategoryLabelForConfirm}
          initialLoading={editLoading}
        />

        <View className="sticky bottom-0 items-center border-t border-border bg-card/95 px-4 py-4 backdrop-blur sm:px-6">
          <View
            className="w-full"
            style={{
              maxWidth: CREATE_REC_MODAL_MAX_W,
              paddingBottom: layout.minSafeBottom,
            }}
          >
            <View className={cn('w-full', primaryDisabled && isWeb && 'cursor-not-allowed')}>
              <Pressable
                onPress={() => {
                  if (primaryDisabled) return;
                  void handlePrimaryFooter();
                }}
                disabled={primaryDisabled && Platform.OS !== 'web'}
                accessibilityRole="button"
                accessibilityLabel={
                  flow.isLastStep
                    ? isEditMode
                      ? 'Save Rex changes'
                      : 'Confirm and post'
                    : 'Continue'
                }
                accessibilityState={{ disabled: primaryDisabled }}
                className={cn(
                  'flex h-12 w-full flex-row items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
                  primaryDisabled
                    ? 'cursor-not-allowed bg-primary/40 opacity-50'
                    : 'cursor-pointer bg-primary active:bg-primary/90',
                )}
              >
                {submitting ? (
                  <ActivityIndicator color={Theme.colors.primaryForeground} />
                ) : (
                  <>
                    <Text
                      pointerEvents="none"
                      className="text-base font-semibold text-primary-foreground"
                    >
                      {flow.isLastStep
                        ? isEditMode
                          ? 'Save Changes'
                          : 'Confirm & Post'
                        : 'Continue'}
                    </Text>
                    {flow.isLastStep ? (
                      <Image
                        source={DYNO_IMAGE_SOURCE}
                        style={{ width: 20, height: 20 }}
                        contentFit="contain"
                        accessibilityLabel="TruRex dinosaur"
                      />
                    ) : null}
                    {!flow.isLastStep && (
                      <View pointerEvents="none">
                        <ChevronRight size={16} color={Theme.colors.primaryForeground} />
                      </View>
                    )}
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </OverlayModal>
  );
};
