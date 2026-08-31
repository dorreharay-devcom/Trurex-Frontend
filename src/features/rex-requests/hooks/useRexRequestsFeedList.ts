import { useMemo, useState } from 'react';
import { useRexRequestsFeed } from '~/features/rex-requests/hooks/useRexRequestsFeed';
import type { RexRequestRow } from '~/features/rex-requests/api/types';

function matchesSearch(row: RexRequestRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    row.looking_for_text.toLowerCase().includes(q) || row.category_name.toLowerCase().includes(q)
  );
}

type UseRexRequestsFeedListArgs = {
  enabled: boolean;
};

export function useRexRequestsFeedList({ enabled }: UseRexRequestsFeedListArgs) {
  const [searchQuery, setSearchQuery] = useState('');
  const feed = useRexRequestsFeed({ enabled });

  const rows = useMemo(
    () => feed.rows.filter((row) => matchesSearch(row, searchQuery)),
    [feed.rows, searchQuery],
  );

  return {
    searchQuery,
    setSearchQuery,
    feed,
    rows,
    hasItems: rows.length > 0,
  };
}
