import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { usePlaceSummary } from '~/features/business/hooks/usePlaceSummary';
import { usePlaceRexesList } from '~/features/business/hooks/usePlaceRexesList';
import { buildScorecardRows } from '~/features/business/lib/placeScorecard';
import { pickBusinessHeaderPhotos } from '~/features/business/lib/placePhotos';
import { parseOptionalRouteId } from '~/shared/lib/navigation/routeIds';

export function useBusinessPage() {
  const raw = useLocalSearchParams<{ rexId: string | string[] }>();
  const rexId = parseOptionalRouteId(raw.rexId) ?? '';
  const [networkOnly, setNetworkOnly] = useState(false);

  const summary = usePlaceSummary(rexId);
  const ready = Boolean(summary.data?.is_visible_business_page);

  const activeList = usePlaceRexesList(rexId, networkOnly, ready);
  const allRexesForPhotos = usePlaceRexesList(rexId, false, ready);

  const scorecardRows = useMemo(
    () => (summary.data ? buildScorecardRows(summary.data.scorecard) : []),
    [summary.data],
  );
  const headerPhotos = useMemo(
    () => pickBusinessHeaderPhotos(allRexesForPhotos.rows),
    [allRexesForPhotos.rows],
  );

  return { rexId, summary, scorecardRows, headerPhotos, networkOnly, setNetworkOnly, activeList };
}

export type BusinessPageState = ReturnType<typeof useBusinessPage>;
