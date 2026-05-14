import { Backend } from '~/services/AuthService';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';
import type {
  CategoryCreateConfig,
  DbCategoryRow,
  CreateRexRpcParams,
} from '~/types/recommendation/rexCategoryCreateConfig';
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
