import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getRexCategoryApiCode } from '~/constants/recommendation/rexCategories';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { createRex, updateRex } from '~/features/rex-create/api/rexCreateApi';
import {
  buildCreateRexParams,
  createRexErrorMessage,
  findSubmitBlocker,
  invalidateRexQueries,
} from '~/features/rex-create/lib/submit';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import { STEP_ID } from '~/types/recommendation/create';
import type { CreateConfigState } from '~/features/rex-create/hooks/useCategoryCreateConfig';
import { toastError, toastInfo, toastSuccess } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { unknownErrorMessage } from '~/utils';

const SUCCESS_TOAST_DELAY_MS = modalConfig.timing.sheetCloseMs + 180;

type UsePrimaryActionArgs = {
  flow: CreateRecFlow;
  config: CreateConfigState;
  isEditMode: boolean;
  editRexId: string | null;
  editLoading: boolean;
  isGeotagging: boolean;
  onClose: () => void;
  onPosted: () => void;
};

export function usePrimaryAction({
  flow,
  config,
  isEditMode,
  editRexId,
  editLoading,
  isGeotagging,
  onClose,
  onPosted,
}: UsePrimaryActionArgs) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);

  const advanceStep = useCallback(async () => {
    if (flow.nav.stepId !== STEP_ID.category) {
      flow.nav.goNext();
      return;
    }
    const code = getRexCategoryApiCode(flow.category.selectedCategoryId);
    if (!code) {
      toastError('Category', 'Choose a category to continue.');
      return;
    }
    setSubmitting(true);
    try {
      await flow.place.persistPlaceForCategory(code);
      flow.nav.goNext();
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Place', unknownErrorMessage(e, 'Could not save this place. Try again.'));
    } finally {
      setSubmitting(false);
    }
  }, [flow]);

  const submitRex = useCallback(async () => {
    const blocker = findSubmitBlocker(flow, config);
    if (blocker) {
      const showToast = blocker.toast === 'error' ? toastError : toastInfo;
      showToast(blocker.title, blocker.message);
      return;
    }
    setSubmitting(true);
    try {
      const params = buildCreateRexParams(flow, config, config.categoryApiCode!);
      if (isEditMode && editRexId) {
        await updateRex({ ...params, p_rex_id: editRexId });
      } else {
        await createRex(params);
      }
      onPosted();
      invalidateRexQueries(queryClient, isEditMode ? editRexId : null);
      onClose();
      setTimeout(() => {
        toastSuccess(
          isEditMode ? 'Updated' : 'Posted',
          isEditMode ? 'Your Rex was updated.' : 'Your recommendation is live.',
        );
      }, SUCCESS_TOAST_DELAY_MS);
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError(
        isEditMode ? 'Could not update' : 'Could not post',
        createRexErrorMessage(unknownErrorMessage(e, 'Something went wrong.')),
      );
    } finally {
      setSubmitting(false);
    }
  }, [flow, config, isEditMode, editRexId, onClose, onPosted, queryClient]);

  const handlePrimaryFooter = useCallback(
    () => (flow.nav.isLastStep ? submitRex() : advanceStep()),
    [flow.nav.isLastStep, submitRex, advanceStep],
  );

  const scorecardRequiredSatisfied = useMemo(
    () =>
      config.mergedQuestions.every(
        (q) => !q.is_required || Boolean(flow.scorecard.questionAnswers[q.code]?.trim()),
      ),
    [config.mergedQuestions, flow.scorecard.questionAnswers],
  );

  const primaryDisabled =
    submitting ||
    editLoading ||
    isGeotagging ||
    (flow.nav.stepId === STEP_ID.scorecard && !scorecardRequiredSatisfied) ||
    (!flow.nav.isLastStep && !flow.nav.canProceed);

  return { submitting, primaryDisabled, handlePrimaryFooter };
}
