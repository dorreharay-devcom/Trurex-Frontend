import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchRexScoreTiers } from '~/features/rex-score/api/rexScoreTiersApi';
import { REX_SCORE_TIERS_QUERY_KEY } from '~/shared/config/queryKeys';
import type { RexScoreTier } from '~/features/rex-score/types/rexScoreTier';

const STALE_TIME = 24 * 60 * 60_000;

export function useRexScoreTiers() {
  const { data, isLoading } = useQuery({
    queryKey: REX_SCORE_TIERS_QUERY_KEY,
    queryFn: fetchRexScoreTiers,
    staleTime: STALE_TIME,
  });

  const tiers = useMemo(
    () => [...(data ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    [data],
  );

  const byCode = useMemo(() => {
    const map = new Map<string, RexScoreTier>();
    tiers.forEach((tier) => map.set(tier.code, tier));
    return map;
  }, [tiers]);

  const getTier = (code: string | null | undefined): RexScoreTier | null =>
    code ? (byCode.get(code) ?? null) : null;

  const isTopTier = (code: string | null | undefined): boolean => {
    const tier = getTier(code);
    if (!tier || tiers.length === 0) return false;
    return tier.sort_order === tiers[tiers.length - 1].sort_order;
  };

  return { tiers, isLoading, getTier, isTopTier };
}
