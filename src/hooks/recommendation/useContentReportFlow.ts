import { useCallback, useEffect, useState } from 'react';
import type {
  ContentReportReasonCode,
  ContentReportTarget,
} from '~/constants/recommendation/contentReport';
import { MAX_CONTENT_REPORT_DETAILS } from '~/constants/recommendation/contentReport';

type Params = {
  open: boolean;
  target: ContentReportTarget | null;
};

export function useContentReportFlow({ open, target }: Params) {
  const [reason, setReason] = useState<ContentReportReasonCode | null>(null);
  const [details, setDetails] = useState('');

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

  const submit = useCallback(async () => {}, []);

  return {
    reason,
    setReason: (c: ContentReportReasonCode) => setReason(c),
    details,
    setDetails: (d: string) => setDetails(d.slice(0, MAX_CONTENT_REPORT_DETAILS)),
    canSubmit: false,
    reset,
    submit,
  };
}
