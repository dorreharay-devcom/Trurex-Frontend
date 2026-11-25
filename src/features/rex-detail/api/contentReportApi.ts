import { Backend, unwrap } from '~/shared/api/client';
import type { FlagReasonRow } from '~/features/rex-detail/types/contentReport';
import {
  firstFiniteNumber,
  firstNonEmptyString,
  isPlainObject,
  unknownAsArray,
} from '~/shared/lib/data/guards';

function normalizeFlagReasonRow(item: unknown): FlagReasonRow | null {
  if (!isPlainObject(item)) return null;
  const code = firstNonEmptyString(item, 'code', 'reason_code');
  if (!code) return null;
  return {
    code,
    label: firstNonEmptyString(item, 'label', 'display_label', 'reason_label') ?? code,
    sort_order: firstFiniteNumber(item, 0, 'sort_order'),
  };
}

function normalizeFlagReasonRows(raw: unknown): FlagReasonRow[] {
  return unknownAsArray(raw)
    .map(normalizeFlagReasonRow)
    .filter((row): row is FlagReasonRow => row != null)
    .sort((a, b) => a.sort_order - b.sort_order);
}

function optionalDetailsPayload(details?: string | null): Record<string, unknown> {
  const trimmed = details?.trim();
  if (!trimmed) return {};
  return { input_details: trimmed };
}

function optionalPDetailsPayload(details?: string | null): Record<string, unknown> {
  const trimmed = details?.trim();
  if (!trimmed) return {};
  return { p_details: trimmed };
}

export async function fetchFlagReasons(): Promise<FlagReasonRow[]> {
  const data = unwrap<unknown>(await Backend.rpc('get_flag_reasons'));
  return normalizeFlagReasonRows(data);
}

export async function flagRex(params: {
  rexId: string;
  reasonCode: string;
  details?: string | null;
}): Promise<void> {
  unwrap(
    await Backend.rpc('flag_rex', {
      input_rex_id: params.rexId,
      input_reason_code: params.reasonCode,
      ...optionalDetailsPayload(params.details),
    }),
  );
}

export async function flagComment(params: {
  commentId: string;
  reasonCode: string;
  details?: string | null;
}): Promise<void> {
  unwrap(
    await Backend.rpc('flag_comment', {
      input_comment_id: params.commentId,
      input_reason_code: params.reasonCode,
      ...optionalDetailsPayload(params.details),
    }),
  );
}

export async function flagRexRequest(params: {
  rexRequestId: string;
  reasonCode: string;
  details?: string | null;
}): Promise<void> {
  unwrap(
    await Backend.rpc('flag_rex_request', {
      p_request_id: params.rexRequestId,
      p_reason_code: params.reasonCode,
      ...optionalPDetailsPayload(params.details),
    }),
  );
}

export async function flagRexRequestComment(params: {
  commentId: string;
  reasonCode: string;
  details?: string | null;
}): Promise<void> {
  unwrap(
    await Backend.rpc('flag_rex_request_comment', {
      p_comment_id: params.commentId,
      p_reason_code: params.reasonCode,
      ...optionalPDetailsPayload(params.details),
    }),
  );
}
