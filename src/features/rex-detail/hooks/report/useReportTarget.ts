import { useCallback, useState } from 'react';
import { useAuth } from '~/features/auth/providers';
import type { ContentReportTarget } from '~/features/rex-detail/types/contentReport';
import type { Recommendation } from '~/shared/types/recommendation';
import { toastInfo } from '~/utils/appToast';

export function useReportTarget(recommendation: Recommendation | null) {
  const { user: authUser } = useAuth();
  const [reportTarget, setReportTarget] = useState<ContentReportTarget | null>(null);

  const clearReportTarget = useCallback(() => setReportTarget(null), []);

  const openRexReport = useCallback(() => {
    if (!recommendation) return;
    if (!authUser) {
      toastInfo('Sign in', 'Sign in to report this recommendation.');
      return;
    }
    if (recommendation.authorId != null && authUser.id === recommendation.authorId) return;
    setReportTarget({ kind: 'recommendation', rexId: recommendation.id });
  }, [recommendation, authUser]);

  const openCommentReport = useCallback(
    (commentId: string) => {
      if (!recommendation) return;
      if (!authUser) {
        toastInfo('Sign in', 'Sign in to report this comment.');
        return;
      }
      setReportTarget({ kind: 'comment', rexId: recommendation.id, commentId });
    },
    [recommendation, authUser],
  );

  return { reportTarget, clearReportTarget, openRexReport, openCommentReport };
}

export type ReportTargetState = ReturnType<typeof useReportTarget>;
