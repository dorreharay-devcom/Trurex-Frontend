import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchRexDetail } from '~/features/rex-detail/api/rexDetailApi';
import { rexDetailRowToRecommendation } from '~/features/rex-detail/lib/rexDetailToRecommendation';

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function useRexDeepLink() {
  const raw = useLocalSearchParams<{
    rexId: string | string[];
    commentId?: string | string[];
    comments?: string | string[];
  }>();
  const rexId = first(raw.rexId)?.trim() ?? '';
  const comments = first(raw.comments);
  const scrollToCommentId = first(raw.commentId)?.trim() || undefined;
  const scrollToComments = !scrollToCommentId && (comments === '1' || comments === 'true');

  const { data, isPending, isError } = useQuery({
    queryKey: ['rexDetail', rexId],
    queryFn: () => fetchRexDetail(rexId),
    enabled: rexId.length > 0,
  });

  const recommendation = useMemo(() => (data ? rexDetailRowToRecommendation(data) : null), [data]);

  return { rexId, scrollToCommentId, scrollToComments, recommendation, isPending, isError };
}

export type RexDeepLinkState = ReturnType<typeof useRexDeepLink>;
