import { Backend } from '~/services/AuthService';

export async function pinCategory(categoryId: string): Promise<string[]> {
  const { data, error } = await Backend.rpc('pin_category', {
    input_category_id: categoryId,
  });
  if (error) throw error;
  return Array.isArray(data) ? (data as string[]) : [];
}

export async function unpinCategory(categoryId: string): Promise<string[]> {
  const { data, error } = await Backend.rpc('unpin_category', {
    input_category_id: categoryId,
  });
  if (error) throw error;
  return Array.isArray(data) ? (data as string[]) : [];
}
