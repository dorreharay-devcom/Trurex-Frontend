import { useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRexCategoryApiCode } from '~/constants/recommendation/rexCategories';
import {
  fetchAllCategoryCreateConfigs,
  fetchCategoryCreateConfig,
} from '~/features/rex-create/api/rexCreateApi';
import { deriveConfigView } from '~/features/rex-create/lib/configMerge';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';

const CONFIGS_STALE_MS = 5 * 60 * 1000;

export type CreateConfigState = ReturnType<typeof useCategoryCreateConfig>;

type UseCategoryCreateConfigArgs = {
  visible: boolean;
  flow: CreateRecFlow;
};

export function useCategoryCreateConfig({ visible, flow }: UseCategoryCreateConfigArgs) {
  const { selectedCategoryId, selectedSubcategoryCode, syncCategoryCreateShape } = flow.category;
  const { syncFormToConfig } = flow;
  const categoryApiCode = getRexCategoryApiCode(selectedCategoryId);

  const { data: configsByCode, isLoading: configsLoading } = useQuery({
    queryKey: ['rexAllCategoryCreateConfigs'],
    queryFn: async () => {
      const list = await fetchAllCategoryCreateConfigs();
      return new Map(list.map((c) => [c.code, c]));
    },
    enabled: visible,
    staleTime: CONFIGS_STALE_MS,
  });

  const needsSingleConfig = Boolean(
    visible && categoryApiCode && configsByCode && !configsByCode.has(categoryApiCode),
  );

  const { data: fetchedSingleConfig, isLoading: singleConfigLoading } = useQuery({
    queryKey: ['rexCategoryCreateConfig', categoryApiCode],
    queryFn: () => fetchCategoryCreateConfig(categoryApiCode!),
    enabled: needsSingleConfig,
  });

  const activeCreateConfig = useMemo(() => {
    if (!categoryApiCode) return null;
    return configsByCode?.get(categoryApiCode) ?? fetchedSingleConfig ?? null;
  }, [categoryApiCode, configsByCode, fetchedSingleConfig]);

  const categoryDefinesSubcategories = Boolean(activeCreateConfig?.subcategories.length);
  const subcategoryCodeForMerge = categoryDefinesSubcategories ? selectedSubcategoryCode : null;

  const view = useMemo(
    () => deriveConfigView(activeCreateConfig, subcategoryCodeForMerge),
    [activeCreateConfig, subcategoryCodeForMerge],
  );

  const formSyncKey = useMemo(() => {
    if (!activeCreateConfig) return null;
    const dimCodes = view.mergedRatingDimensions.map((d) => d.code).join('|');
    const questionCodes = view.mergedQuestions
      .map((q) => `${q.code}:${q.is_required ? 1 : 0}:${q.type ?? 'select'}`)
      .join('|');
    return [activeCreateConfig.code, subcategoryCodeForMerge ?? '', dimCodes, questionCodes].join(
      '#',
    );
  }, [activeCreateConfig, subcategoryCodeForMerge, view]);

  const appliedSyncKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!formSyncKey || formSyncKey === appliedSyncKeyRef.current) return;
    appliedSyncKeyRef.current = formSyncKey;
    syncFormToConfig(view.mergedRatingDimensions);
  }, [formSyncKey, view, syncFormToConfig]);

  useEffect(() => {
    syncCategoryCreateShape(activeCreateConfig);
  }, [activeCreateConfig, syncCategoryCreateShape]);

  const configLoading =
    Boolean(visible && selectedCategoryId && categoryApiCode) &&
    (configsLoading || singleConfigLoading);
  const configLoadError = Boolean(
    selectedCategoryId && categoryApiCode && !configLoading && !activeCreateConfig,
  );
  const configReady = Boolean(
    !selectedCategoryId || (categoryApiCode && activeCreateConfig && !configLoadError),
  );

  return {
    ...view,
    categoryApiCode,
    activeCreateConfig,
    configLoading,
    configLoadError,
    configReady,
    subcategoryCodeForMerge,
    showQuickTip: view.mergedTagOptions.length > 0,
    useExperienceReviewCopy: categoryDefinesSubcategories,
  };
}
