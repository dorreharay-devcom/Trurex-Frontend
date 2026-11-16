import { useLocalSearchParams } from 'expo-router';
import {
  usePlaceBusinessPage,
  type PlaceBusinessPageState,
} from '~/features/business/hooks/usePlaceBusinessPage';
import { rexPlaceRef } from '~/features/business/lib/placeRef';
import { parseOptionalRouteId } from '~/shared/lib/navigation/routeIds';

export function useBusinessPage() {
  const raw = useLocalSearchParams<{ rexId: string | string[] }>();
  return usePlaceBusinessPage(rexPlaceRef(parseOptionalRouteId(raw.rexId)));
}

export type BusinessPageState = PlaceBusinessPageState;
