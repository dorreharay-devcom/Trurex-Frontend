import { Backend, unwrap } from '~/services/AuthService';
import type { RexDetailRow } from '~/types/recommendation/rexDetail';

function normalizeRexDetailPayload(data: unknown): RexDetailRow | null {
  if (data == null) {
    return null;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return null;
    }
    const first = data[0];
    if (first != null && typeof first === 'object') {
      return first as RexDetailRow;
    }
    return null;
  }
  if (typeof data === 'object') {
    return data as RexDetailRow;
  }
  return null;
}

export async function fetchRexDetail(rexId: string): Promise<RexDetailRow> {
  const data = unwrap(
    await Backend.rpc('get_rex_detail', {
      input_rex_id: rexId,
    }),
  );
  const row = normalizeRexDetailPayload(data);
  if (row == null) {
    throw new Error('Rex not found');
  }
  return row;
}
