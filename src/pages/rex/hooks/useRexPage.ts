import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchRexDetail } from '~/features/rex-detail/api/rexDetailApi';
import { rexDetailRowToRecommendation } from '~/features/rex-detail/lib/rexDetailToRecommendation';
import { firstRouteParam, parseOptionalRouteId } from '~/shared/lib/navigation/routeIds';

export function useRexPage() {
  const raw = useLocalSearchParams<{
    rexId: string | string[];
    commentId?: string | string[];
    comments?: string | string[];
  }>();
  const rexId = parseOptionalRouteId(raw.rexId) ?? '';
  const comments = firstRouteParam(raw.comments);
  const scrollToCommentId = parseOptionalRouteId(raw.commentId) ?? undefined;
  const scrollToComments = !scrollToCommentId && (comments === '1' || comments === 'true');

  const { data, isPending, isError } = useQuery({
    queryKey: ['rexDetail', rexId],
    queryFn: () => fetchRexDetail(rexId),
    enabled: rexId.length > 0,
  });

  const recommendation = useMemo(() => (data ? rexDetailRowToRecommendation(data) : null), [data]);

  return { rexId, scrollToCommentId, scrollToComments, recommendation, isPending, isError };
}

export type RexPageState = ReturnType<typeof useRexPage>;
