import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as ContentReportApi from '~/features/rex-detail/api/contentReportApi';
import {
  CONTENT_REPORT_OTHER_CODE,
  MAX_CONTENT_REPORT_DETAILS,
} from '~/features/rex-detail/config/contentReport';
import type { ContentReportTarget } from '~/features/rex-detail/types/contentReport';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { useAuth } from '~/features/auth/providers';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';

type Params = {
  open: boolean;
  target: ContentReportTarget | null;
};

export function useContentReportFlow({ open, target }: Params) {
  const { user } = useAuth();
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonsQuery = useQuery({
    queryKey: ['moderation', 'flagReasons'],
    queryFn: () => ContentReportApi.fetchFlagReasons(),
    enabled: open && user != null,
    staleTime: 60 * 60 * 1000,
  });

  const reasonOptions = useMemo(
    () =>
      (reasonsQuery.data ?? []).map((r) => ({
        value: r.code,
        label: r.label,
      })),
    [reasonsQuery.data],
  );

  const reset = useCallback(() => {
    setReason(null);
    setDetails('');
  }, []);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(reset, 0);
      return () => clearTimeout(t);
    }
  }, [open, reset]);

  useEffect(() => {
    if (open) {
      setReason(null);
      setDetails('');
    }
  }, [open, target]);

  const otherSelected =
    reason != null && reason.toLowerCase() === CONTENT_REPORT_OTHER_CODE.toLowerCase();
  const canSubmit =
    Boolean(reason && reason.length > 0) &&
    reasonOptions.length > 0 &&
    (!otherSelected || details.trim().length > 0) &&
    !isSubmitting;

  const submit = useCallback(async (): Promise<boolean> => {
    if (!target || reason == null) return false;
    if (otherSelected && !details.trim()) {
      toastError('Details required', 'Please describe the issue when reporting as Other.');
      return false;
    }
    if (!assertOnlineForMutation('Reporting')) return false;
    setIsSubmitting(true);
    try {
      const detailPayload = details.trim() || null;
      switch (target.kind) {
        case 'recommendation':
          await ContentReportApi.flagRex({
            rexId: target.rexId,
            reasonCode: reason,
            details: detailPayload,
          });
          break;
        case 'comment':
          await ContentReportApi.flagComment({
            commentId: target.commentId,
            reasonCode: reason,
            details: detailPayload,
          });
          break;
        case 'rex_request':
          await ContentReportApi.flagRexRequest({
            rexRequestId: target.rexRequestId,
            reasonCode: reason,
            details: detailPayload,
          });
          break;
        case 'rex_request_comment':
          await ContentReportApi.flagRexRequestComment({
            commentId: target.commentId,
            reasonCode: reason,
            details: detailPayload,
          });
          break;
      }
      toastSuccess('Report sent', 'Thanks — our team will review it.');
      reset();
      return true;
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return false;
      toastError('Could not send report', unknownErrorMessage(e, 'Try again.'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [target, reason, details, otherSelected, reset]);

  return {
    reason,
    setReason,
    details,
    setDetails: (d: string) => setDetails(d.slice(0, MAX_CONTENT_REPORT_DETAILS)),
    otherSelected,
    reasonOptions,
    reasonsLoading: reasonsQuery.isPending || reasonsQuery.isFetching,
    reasonsError: reasonsQuery.isError,
    refetchReasons: reasonsQuery.refetch,
    canSubmit,
    isSubmitting,
    reset,
    submit,
  };
}

export type ContentReportFlow = ReturnType<typeof useContentReportFlow>;
