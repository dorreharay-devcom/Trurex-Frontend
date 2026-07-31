import { useCallback, useEffect, useState } from 'react';
import { STEP_ID, type CreateRecStepId } from '~/types/recommendation/create';
import { resolveStepIdAfterStepsChange } from '~/features/rex-create/lib/steps';

export function useStepNavigation(activeSteps: CreateRecStepId[]) {
  const [stepId, setStepId] = useState<CreateRecStepId>(STEP_ID.search);

  useEffect(() => {
    setStepId((prev) => resolveStepIdAfterStepsChange(prev, activeSteps));
  }, [activeSteps]);

  const rawIndex = activeSteps.indexOf(stepId);
  const stepIndex = rawIndex >= 0 ? rawIndex : 0;

  const isFirstStep = stepId === STEP_ID.search;
  const isLastStep = activeSteps.length > 0 && stepId === activeSteps[activeSteps.length - 1];

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

  const reset = useCallback(() => {
    setStepId(STEP_ID.search);
  }, []);

  return { stepId, stepIndex, isFirstStep, isLastStep, goNext, goBack, reset };
}
