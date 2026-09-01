import { useState } from 'react';
import { useRexRequestsFeed } from '~/features/rex-requests/hooks/useRexRequestsFeed';
import {
  audienceFiltersToCircleParams,
  type AudienceFilterId,
} from '~/features/discover/config/audienceFilters';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/shared/hooks/useDebouncedValue';

type UseRexRequestsFeedListArgs = {
  enabled: boolean;
};

export function useRexRequestsFeedList({ enabled }: UseRexRequestsFeedListArgs) {
  const [searchQuery, setSearchQuery] = useState('');
  const [circleFilter, setCircleFilter] = useState<AudienceFilterId[]>([]);
  const debouncedSearchQuery = useDebouncedValue(searchQuery, DEFAULT_SEARCH_DEBOUNCE_MS);
  const circleFilterParams = audienceFiltersToCircleParams(circleFilter) ?? [];
  const feed = useRexRequestsFeed({
    enabled,
    search: debouncedSearchQuery,
    circleFilter: circleFilterParams,
  });

  return {
    searchQuery,
    setSearchQuery,
    circleFilter,
    setCircleFilter,
    feed,
    rows: feed.rows,
    hasItems: feed.rows.length > 0,
  };
}
