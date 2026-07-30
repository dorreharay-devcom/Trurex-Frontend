import { Backend, unwrap } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';
import type { RexDetailRow } from '~/types/recommendation/rexDetail';

function tryJsonStringAsArray(s: string): unknown[] | null {
  if (!s.trim().startsWith('[')) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(s);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) {
    return null;
  }
  return parsed;
}

function asUnknownArray(v: unknown): unknown[] | null {
  if (Array.isArray(v)) {
    return v;
  }
  if (typeof v !== 'string') {
    return null;
  }
  return tryJsonStringAsArray(v);
}

function photoPathsFromUnknown(v: unknown): string[] {
  const raw = asUnknownArray(v);
  if (raw == null) {
    return [];
  }
  return raw.map((p) => String(p).trim()).filter((p) => p.length > 0);
}

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
      const o = first as Record<string, unknown>;
      return { ...(first as RexDetailRow), photo_paths: photoPathsFromUnknown(o.photo_paths) };
    }
    return null;
  }
  if (typeof data === 'object' && data !== null) {
    const o = data as Record<string, unknown>;
    return { ...(data as RexDetailRow), photo_paths: photoPathsFromUnknown(o.photo_paths) };
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

export async function deleteRex(rexId: string): Promise<void> {
  const trimmed = rexId.trim();
  if (!trimmed) {
    throw new Error('Missing rex id');
  }
  throwRpcIfFailed(
    await Backend.rpc('delete_rex', {
      input_rex_id: trimmed,
    }),
  );
}
