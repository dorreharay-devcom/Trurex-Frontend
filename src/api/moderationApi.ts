import { Backend, unwrap } from '~/services/AuthService';
import type { ContentFlagRow, FlagReasonRow } from '~/types/moderation';

function normalizeFlagReasonRows(raw: unknown): FlagReasonRow[] {
  if (!Array.isArray(raw)) return [];
  const out: FlagReasonRow[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const code = String(o.code ?? o.reason_code ?? '').trim();
    if (!code) continue;
    const label = String(o.label ?? o.display_label ?? o.reason_label ?? code).trim();
    const sortOrderRaw = o.sort_order;
    const sort_order =
      typeof sortOrderRaw === 'number' && !Number.isNaN(sortOrderRaw)
        ? sortOrderRaw
        : Number(sortOrderRaw) || 0;
    out.push({ code, label, sort_order });
  }
  return out.slice().sort((a, b) => a.sort_order - b.sort_order);
}

export async function fetchFlagReasons(): Promise<FlagReasonRow[]> {
  const data = unwrap<unknown>(await Backend.rpc('get_flag_reasons'));
  return normalizeFlagReasonRows(data);
}

export async function flagRex(params: {
  rexId: string;
  reasonCode: string;
  details?: string | null;
}): Promise<ContentFlagRow | ContentFlagRow[]> {
  const payload: Record<string, unknown> = {
    input_rex_id: params.rexId,
    input_reason_code: params.reasonCode,
  };
  if (params.details != null && params.details.trim() !== '') {
    payload.input_details = params.details.trim();
  }
  const data = unwrap<unknown>(await Backend.rpc('flag_rex', payload));
  if (Array.isArray(data) && data[0]) return data[0] as ContentFlagRow;
  return data as ContentFlagRow;
}

export async function flagComment(params: {
  commentId: string;
  reasonCode: string;
  details?: string | null;
}): Promise<ContentFlagRow | ContentFlagRow[]> {
  const payload: Record<string, unknown> = {
    input_comment_id: params.commentId,
    input_reason_code: params.reasonCode,
  };
  if (params.details != null && params.details.trim() !== '') {
    payload.input_details = params.details.trim();
  }
  const data = unwrap<unknown>(await Backend.rpc('flag_comment', payload));
  if (Array.isArray(data) && data[0]) return data[0] as ContentFlagRow;
  return data as ContentFlagRow;
}
