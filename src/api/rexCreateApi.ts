import { Backend } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';
import type {
  CategoryCreateConfig,
  DbCategoryRow,
  CreateRexRpcParams,
  UpdateRexRpcParams,
} from '~/types/recommendation/rexCategoryCreateConfig';
import type { RexForEditRow } from '~/types/recommendation/rexDetail';
import type { DiscardDraftRexDataResult } from '~/types/recommendation/rexApi';
import { isFiniteNumber, isPlainObject } from '~/utils/guards';

export type { DiscardDraftRexDataResult };

export async function fetchActiveCategories(): Promise<DbCategoryRow[]> {
  const { data, error } = await Backend.from('categories')
    .select('id, code, display_name, sort_order, icon')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  throwRpcIfFailed({ data, error });
  return (data ?? []) as DbCategoryRow[];
}

export async function fetchAllCategoryCreateConfigs(): Promise<CategoryCreateConfig[]> {
  const { data, error } = await Backend.rpc('get_all_category_create_configs');
  throwRpcIfFailed({ data, error });
  return (data ?? []) as CategoryCreateConfig[];
}

export async function fetchCategoryCreateConfig(
  categoryCode: string,
): Promise<CategoryCreateConfig | null> {
  const { data, error } = await Backend.rpc('get_category_create_config', {
    p_category_code: categoryCode,
  });
  throwRpcIfFailed({ data, error });
  return (data ?? null) as CategoryCreateConfig | null;
}

export async function createRex(params: CreateRexRpcParams) {
  const { data, error } = await Backend.rpc('create_rex', params);
  throwRpcIfFailed({ data, error });
  return data;
}

function stringListFromUnknown(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x).trim()).filter(Boolean);
}

function normalizeRexForEditPayload(data: unknown): RexForEditRow | null {
  if (data == null) return null;
  const row = Array.isArray(data) ? data[0] : data;
  if (row == null || typeof row !== 'object') return null;
  const o = row as Record<string, unknown>;
  return {
    ...(row as RexForEditRow),
    circle_ids: stringListFromUnknown(o.circle_ids),
    tag_slugs: stringListFromUnknown(o.tag_slugs),
    photo_paths: stringListFromUnknown(o.photo_paths),
  };
}

export async function fetchRexForEdit(rexId: string): Promise<RexForEditRow> {
  const { data, error } = await Backend.rpc('get_rex_for_edit', {
    input_rex_id: rexId,
  });
  throwRpcIfFailed({ data, error });
  const row = normalizeRexForEditPayload(data);
  if (row == null) {
    throw new Error('Rex not found or not owned by you.');
  }
  return row;
}

export async function updateRex(params: UpdateRexRpcParams) {
  const { data, error } = await Backend.rpc('update_rex', params);
  throwRpcIfFailed({ data, error });
  return data;
}

export async function discardDraftRexData(): Promise<DiscardDraftRexDataResult> {
  const { data, error } =
    await Backend.functions.invoke<DiscardDraftRexDataResult>('discard_draft_rex_data');
  throwRpcIfFailed({ data, error });
  if (
    !isPlainObject(data) ||
    !isFiniteNumber(data.deletedObjectCount) ||
    !isFiniteNumber(data.deletedManualPlaceCount)
  ) {
    throw new Error('discard_draft_rex_data: invalid or empty response');
  }
  return data as DiscardDraftRexDataResult;
}
