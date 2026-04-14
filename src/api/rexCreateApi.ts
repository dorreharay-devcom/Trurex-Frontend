import { Backend } from '~/services/AuthService';
import type {
  CategoryCreateConfig,
  DbCategoryRow,
  CreateRexRpcParams,
} from '~/types/recommendation/rexCategoryCreateConfig';

export async function fetchActiveCategories(): Promise<DbCategoryRow[]> {
  const { data, error } = await Backend.from('categories')
    .select('code, display_name, sort_order')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as DbCategoryRow[];
}

export async function fetchAllCategoryCreateConfigs(): Promise<CategoryCreateConfig[]> {
  const { data, error } = await Backend.rpc('get_all_category_create_configs');
  if (error) throw error;
  return (data ?? []) as CategoryCreateConfig[];
}

export async function fetchCategoryCreateConfig(
  categoryCode: string,
): Promise<CategoryCreateConfig | null> {
  const { data, error } = await Backend.rpc('get_category_create_config', {
    p_category_code: categoryCode,
  });
  if (error) throw error;
  return (data ?? null) as CategoryCreateConfig | null;
}

export async function createRex(params: CreateRexRpcParams) {
  const { data, error } = await Backend.rpc('create_rex', params);
  if (error) throw error;
  return data;
}
