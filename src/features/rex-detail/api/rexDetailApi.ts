import { Backend, unwrap } from '~/shared/api/client';
import type { RexDetailRow } from '~/features/rex-detail/types/rexDetail';
import { coerceStringList, firstRecord } from '~/shared/lib/data/guards';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';

export async function fetchRexDetail(rexId: string): Promise<RexDetailRow> {
  const data = unwrap(
    await Backend.rpc('get_rex_detail', {
      input_rex_id: rexId,
    }),
  );
  const record = firstRecord(data);
  if (record == null) throw new Error('Rex not found');

  return {
    ...(record as unknown as RexDetailRow),
    photo_paths: coerceStringList(record.photo_paths),
  };
}

export async function deleteRex(rexId: string): Promise<void> {
  const trimmed = rexId.trim();
  if (!trimmed) throw new Error('Missing rex id');

  throwRpcIfFailed(
    await Backend.rpc('delete_rex', {
      input_rex_id: trimmed,
    }),
  );
}
