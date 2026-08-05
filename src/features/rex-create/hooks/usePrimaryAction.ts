import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '~/features/auth/providers';
import { createRex, updateRex } from '~/features/rex-create/api/rexCreateApi';
import type { CreateConfigState } from '~/features/rex-create/hooks/useCategoryCreateConfig';
import type { CreateRecFlow } from '~/features/rex-create/hooks/useCreateRecWizard';
import { buildOptimisticRecommendationFromCreate } from '~/features/rex-create/lib/buildOptimisticRecommendation';
import { getRexCategoryApiCode } from '~/features/rex-create/lib/categories';
import { parseCreatedRexId } from '~/features/rex-create/lib/parseCreatedRexId';
import {
  buildCreateRexParams,
  createRexErrorMessage,
  findSubmitBlocker,
} from '~/features/rex-create/lib/submit';
import { STEP_ID } from '~/features/rex-create/types/create';
import { mapPinRowFromOptimisticRec } from '~/features/map/lib/pinTypes';
import { toastError, toastInfo, toastSuccess } from '~/shared/lib/appToast';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';
import { track, AnalyticsEvent } from '~/shared/lib/analytics/track';
import {
  invalidateAfterRexWrite,
  prependMapPinToCaches,
  prependRecommendationToFeedCaches,
} from '~/shared/lib/query/invalidateAfterRexWrite';
import { modalConfig } from '~/shared/config/overlaySheet';

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
  const { user } = useAuth();
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
    if (!assertOnlineForMutation('Saving place')) return;
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
    if (!assertOnlineForMutation(isEditMode ? 'Updating' : 'Posting')) return;
    setSubmitting(true);
    try {
      const params = buildCreateRexParams(flow, config, config.categoryApiCode!);

      if (isEditMode && editRexId) {
        await updateRex({ ...params, p_rex_id: editRexId });
      } else {
        const created = await createRex(params);
        const rexId = parseCreatedRexId(created);
        if (rexId) {
          const authorName =
            (typeof user?.user_metadata?.display_name === 'string' &&
              user.user_metadata.display_name) ||
            user?.email ||
            undefined;
          const stub = buildOptimisticRecommendationFromCreate({
            rexId,
            flow,
            config,
            authorId: user?.id,
            authorName,
          });
          prependRecommendationToFeedCaches(queryClient, stub);
          const pin = mapPinRowFromOptimisticRec(stub);
          if (pin) prependMapPinToCaches(queryClient, pin);
        }
        track(AnalyticsEvent.RexCreated);
      }

      onPosted();
      invalidateAfterRexWrite(queryClient, {
        editRexId: isEditMode ? editRexId : null,
      });
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
  }, [flow, config, isEditMode, editRexId, onClose, onPosted, queryClient, user]);

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
