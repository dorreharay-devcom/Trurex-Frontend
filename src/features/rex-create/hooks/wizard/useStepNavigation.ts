import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { STEP_ID, type CreateRecStepId } from '~/features/rex-create/types/create';
import {
  isCreateRecStepId,
  parseCreateStepParam,
  resolveStepIdAfterStepsChange,
} from '~/features/rex-create/lib/steps';
import { firstRouteParam } from '~/shared/lib/navigation/routeIds';

function setCreateStepParam(
  router: { setParams: (p: Record<string, string | undefined>) => void },
  step: CreateRecStepId,
) {
  router.setParams({ step });
}

export function useStepNavigation(activeSteps: CreateRecStepId[]) {
  const router = useRouter();
  const raw = useLocalSearchParams<{ step?: string | string[] }>();
  const stepFromUrl = parseCreateStepParam(firstRouteParam(raw.step));

  const stepId = useMemo(
    () => resolveStepIdAfterStepsChange(stepFromUrl ?? STEP_ID.search, activeSteps),
    [stepFromUrl, activeSteps],
  );

  const rawIndex = activeSteps.indexOf(stepId);
  const stepIndex = rawIndex >= 0 ? rawIndex : 0;

  const isFirstStep = stepId === STEP_ID.search;
  const isLastStep = activeSteps.length > 0 && stepId === activeSteps[activeSteps.length - 1];

  const goNext = useCallback(() => {
    const idx = activeSteps.indexOf(stepId);
    if (idx < 0 || idx >= activeSteps.length - 1) return;
    const next = activeSteps[idx + 1];
    if (isCreateRecStepId(next)) setCreateStepParam(router, next);
  }, [activeSteps, stepId, router]);

  const goBack = useCallback(() => {
    const idx = activeSteps.indexOf(stepId);
    if (idx <= 0) return;
    const prev = activeSteps[idx - 1];
    if (isCreateRecStepId(prev)) setCreateStepParam(router, prev);
  }, [activeSteps, stepId, router]);

  const reset = useCallback(() => {
    setCreateStepParam(router, STEP_ID.search);
  }, [router]);

  return { stepId, stepIndex, isFirstStep, isLastStep, goNext, goBack, reset };
}
