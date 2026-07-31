import { useCallback, useMemo, useState } from 'react';
import { getActiveCreateRecSteps } from '~/types/recommendation/create';
import type { CategoryCreateConfig } from '~/types/recommendation/rexCategoryCreateConfig';

export function useCategorySelection() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryCode, setSelectedSubcategoryCode] = useState<string | null>(null);
  const [hasSubcategoryStep, setHasSubcategoryStep] = useState(false);

  const syncCategoryCreateShape = useCallback((config: CategoryCreateConfig | null) => {
    setHasSubcategoryStep((config?.subcategories?.length ?? 0) > 0);
  }, []);

  const activeSteps = useMemo(
    () => getActiveCreateRecSteps(selectedCategoryId, hasSubcategoryStep),
    [selectedCategoryId, hasSubcategoryStep],
  );

  const reset = useCallback(() => {
    setSelectedCategoryId(null);
    setSelectedSubcategoryCode(null);
    setHasSubcategoryStep(false);
  }, []);

  return {
    selectedCategoryId,
    setSelectedCategoryId,
    selectedSubcategoryCode,
    setSelectedSubcategoryCode,
    setHasSubcategoryStep,
    syncCategoryCreateShape,
    activeSteps,
    reset,
  };
}
