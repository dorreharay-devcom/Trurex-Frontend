import { useCallback, useMemo, useReducer } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePlaceSummary } from '~/features/business/hooks/usePlaceSummary';
import { rexPlaceRef } from '~/features/business/lib/placeRef';
import { BusinessAccountApi } from '~/features/business-account/api/businessAccountApi';
import { CLAIM_FLOW_ENTRY } from '~/features/business-account/config/claim';
import {
  claimFlowReducer,
  INITIAL_CLAIM_FLOW_STATE,
} from '~/features/business-account/lib/claimFlow';
import {
  businessClaimErrorMessage,
  isBusinessClaimAlreadyPending,
} from '~/features/business-account/lib/claimErrors';
import { claimSubjectTitle, resolveClaimTarget } from '~/features/business-account/lib/claimTarget';
import type { ClaimSubject } from '~/features/business-account/types/claim';
import { toastError } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { isOfflineMutationBlocked, withOnlineMutation } from '~/shared/lib/network/assertOnline';
import { invalidateBusinessAccount } from '~/shared/lib/query/invalidateBusinessAccount';

const submitClaim = withOnlineMutation('Claiming a business', BusinessAccountApi.submitClaim);

export function useBusinessClaimFlow() {
  const queryClient = useQueryClient();
  const [state, dispatch] = useReducer(claimFlowReducer, INITIAL_CLAIM_FLOW_STATE);

  const pickedRexId = state.subject?.kind === 'rex' ? state.subject.rexId : null;
  const summary = usePlaceSummary(rexPlaceRef(pickedRexId));
  const summaryIdentity = summary.isError ? null : summary.data;

  const target = useMemo(
    () => resolveClaimTarget(state.subject, summaryIdentity),
    [state.subject, summaryIdentity],
  );

  const { mutate, isPending } = useMutation({
    mutationFn: submitClaim,
    onSuccess: () => {
      dispatch({ type: 'submitted' });
      invalidateBusinessAccount(queryClient);
    },
    onError: (error) => {
      if (isBusinessClaimAlreadyPending(error)) invalidateBusinessAccount(queryClient);
      if (isOfflineMutationBlocked(error) || didAccountFrozenMutationToast(error)) return;
      toastError("Couldn't submit claim", businessClaimErrorMessage(error));
    },
  });

  const proceed = useCallback(() => {
    if (target) mutate(target);
  }, [mutate, target]);

  const actions = useMemo(
    () => ({
      start: (subject: ClaimSubject | null = null) => dispatch({ type: 'open', subject }),
      pick: (rexId: string, title: string) => dispatch({ type: 'pick', rexId, title }),
      startVerification: () => dispatch({ type: 'startVerification' }),
      back: () => dispatch({ type: 'back' }),
      close: () => dispatch({ type: 'close' }),
      reset: () => dispatch({ type: 'reset' }),
    }),
    [],
  );

  return {
    ...actions,
    open: state.open,
    step: state.step,
    returnsToSearch: state.entry === CLAIM_FLOW_ENTRY.find,
    subjectTitle: claimSubjectTitle(state.subject),
    target,
    targetLoading: Boolean(pickedRexId) && target == null && summary.isPending,
    submitting: isPending,
    proceed,
  };
}

export type BusinessClaimFlow = ReturnType<typeof useBusinessClaimFlow>;
