import type { QueryClient } from '@tanstack/react-query';
import {
  PLACE_REXES_QUERY_KEY_ROOT,
  PLACE_SUMMARY_QUERY_KEY_ROOT,
  REX_QUERY_KEYS,
} from '~/shared/config/queryKeys';

const REX_SURFACE_KEYS = [
  REX_QUERY_KEYS.discoverFeed,
  REX_QUERY_KEYS.searchRexes,
  REX_QUERY_KEYS.myRexes,
  REX_QUERY_KEYS.mySavedRexes,
  REX_QUERY_KEYS.mapRexesInBounds,
  REX_QUERY_KEYS.mapRexPins,
] as const;

export function invalidateActiveRexSurfaces(
  queryClient: QueryClient,
  options?: { editRexId?: string | null; includeCollections?: boolean },
) {
  for (const queryKey of REX_SURFACE_KEYS) {
    void queryClient.invalidateQueries({ queryKey, refetchType: 'active' });
  }

  void queryClient.invalidateQueries({
    queryKey: PLACE_SUMMARY_QUERY_KEY_ROOT,
    refetchType: 'active',
  });
  void queryClient.invalidateQueries({
    queryKey: PLACE_REXES_QUERY_KEY_ROOT,
    refetchType: 'active',
  });

  if (options?.includeCollections !== false) {
    void queryClient.invalidateQueries({
      queryKey: ['collection-detail'],
      refetchType: 'active',
    });
    void queryClient.invalidateQueries({
      queryKey: ['my-collections'],
      refetchType: 'active',
    });
  }

  if (options?.editRexId) {
    void queryClient.invalidateQueries({ queryKey: ['rexDetail', options.editRexId] });
    void queryClient.invalidateQueries({ queryKey: ['rexForEdit', options.editRexId] });
  }
}
