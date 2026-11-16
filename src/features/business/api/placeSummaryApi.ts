import { Backend, unwrap } from '~/shared/api/client';
import { firstRecord } from '~/shared/lib/data/guards';
import { placeRefRpcParams } from '~/features/business/lib/placeRef';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';
import type { PlaceRef } from '~/shared/types/placeRef';

export async function fetchPlaceSummary(ref: PlaceRef): Promise<PlaceSummaryRow> {
  const data = unwrap(await Backend.rpc('get_place_summary', placeRefRpcParams(ref)));
  const record = firstRecord(data);
  if (record == null) throw new Error('Place summary not found');
  return record as unknown as PlaceSummaryRow;
}
