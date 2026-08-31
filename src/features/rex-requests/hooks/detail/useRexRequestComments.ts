import { useCallback, useEffect, useState } from 'react';
import {
  commentOnRexRequest,
  getRexRequestComments,
} from '~/features/rex-requests/api/rexRequestsApi';
import type { RexRequestCommentRow } from '~/features/rex-requests/api/types';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';

export function useRexRequestComments(requestId: string) {
  const [comments, setComments] = useState<RexRequestCommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const rows = await getRexRequestComments(requestId);
      setComments(rows);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const addComment = useCallback(
    async (body: string) => {
      if (!assertOnlineForMutation('Commenting')) return;
      await commentOnRexRequest(requestId, body);
      await refetch();
    },
    [requestId, refetch],
  );

  return { comments, loading, loadError, refetch, addComment };
}

export type RexRequestCommentsState = ReturnType<typeof useRexRequestComments>;
