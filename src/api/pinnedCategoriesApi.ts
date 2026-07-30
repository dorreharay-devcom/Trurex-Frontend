import { Backend } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';

export async function pinCategory(categoryId: string): Promise<string[]> {
  const { data, error } = await Backend.rpc('pin_category', {
    input_category_id: categoryId,
  });
  throwRpcIfFailed({ data, error });
  return Array.isArray(data) ? (data as string[]) : [];
}

export async function unpinCategory(categoryId: string): Promise<string[]> {
  const { data, error } = await Backend.rpc('unpin_category', {
    input_category_id: categoryId,
  });
  throwRpcIfFailed({ data, error });
  return Array.isArray(data) ? (data as string[]) : [];
}
