import { Backend, unwrap } from '~/shared/api/client';
import { firstRecord } from '~/shared/lib/data/guards';
import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';

export async function fetchPlaceSummary(rexId: string): Promise<PlaceSummaryRow> {
  const data = unwrap(await Backend.rpc('get_place_summary', { p_rex_id: rexId }));
  const record = firstRecord(data);
  if (record == null) throw new Error('Place summary not found');
  return record as unknown as PlaceSummaryRow;
}
