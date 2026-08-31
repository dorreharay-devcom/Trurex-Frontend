import { useCallback, useState } from 'react';
import { useAuth } from '~/features/auth/providers';
import type { ContentReportTarget } from '~/features/rex-detail/types/contentReport';
import { toastInfo } from '~/shared/lib/appToast';

export function useRexRequestReportTarget(
  requestId: string | undefined,
  requesterId: string | undefined,
) {
  const { user: authUser } = useAuth();
  const [reportTarget, setReportTarget] = useState<ContentReportTarget | null>(null);

  const clearReportTarget = useCallback(() => setReportTarget(null), []);

  const openReport = useCallback(() => {
    if (!requestId) return;
    if (!authUser) {
      toastInfo('Sign in', 'Sign in to report this request.');
      return;
    }
    if (requesterId != null && authUser.id === requesterId) return;
    setReportTarget({ kind: 'rex_request', rexRequestId: requestId });
  }, [requestId, requesterId, authUser]);

  const openCommentReport = useCallback(
    (commentId: string) => {
      if (!requestId) return;
      if (!authUser) {
        toastInfo('Sign in', 'Sign in to report this comment.');
        return;
      }
      setReportTarget({ kind: 'rex_request_comment', rexRequestId: requestId, commentId });
    },
    [requestId, authUser],
  );

  return { reportTarget, clearReportTarget, openReport, openCommentReport };
}

export type RexRequestReportTargetState = ReturnType<typeof useRexRequestReportTarget>;
