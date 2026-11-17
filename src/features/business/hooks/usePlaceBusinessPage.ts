import { useMemo, useState } from 'react';
import { usePlaceSummary } from '~/features/business/hooks/usePlaceSummary';
import { usePlaceRexesList } from '~/features/business/hooks/usePlaceRexesList';
import { buildScorecardRows } from '~/features/business/lib/placeScorecard';
import { pickBusinessHeaderPhotos } from '~/features/business/lib/placePhotos';
import type { PlaceRef } from '~/shared/types/placeRef';

export function usePlaceBusinessPage(ref: PlaceRef | null) {
  const [networkOnly, setNetworkOnly] = useState(false);

  const summary = usePlaceSummary(ref);
  const ready = Boolean(summary.data?.is_visible_business_page);

  const activeList = usePlaceRexesList(ref, networkOnly, ready);
  const allRexesForPhotos = usePlaceRexesList(ref, false, ready);

  const scorecardRows = useMemo(
    () => (summary.data ? buildScorecardRows(summary.data.scorecard) : []),
    [summary.data],
  );
  const headerPhotos = useMemo(
    () => pickBusinessHeaderPhotos(allRexesForPhotos.rows),
    [allRexesForPhotos.rows],
  );

  return { ref, summary, scorecardRows, headerPhotos, networkOnly, setNetworkOnly, activeList };
}

export type PlaceBusinessPageState = ReturnType<typeof usePlaceBusinessPage>;
