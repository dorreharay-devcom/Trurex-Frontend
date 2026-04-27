import { Backend } from '~/services/AuthService';
import { isPlainObject } from '~/utils';

export type UserConfigRow = {
  avatar_url: string | null;
  pinned_category_ids: string[];
};

const emptyUserConfig = (): UserConfigRow => ({
  avatar_url: null,
  pinned_category_ids: [],
});

function normalizeUserConfigResponse(data: unknown): UserConfigRow {
  if (data == null) {
    return emptyUserConfig();
  }
  if (Array.isArray(data) && isPlainObject(data[0])) {
    return data[0] as UserConfigRow;
  }
  if (isPlainObject(data) && 'pinned_category_ids' in data) {
    return data as UserConfigRow;
  }
  return emptyUserConfig();
}

export async function fetchUserPinnedCategoryIds(): Promise<string[]> {
  const { data, error } = await Backend.rpc('user_config');
  if (error) throw error;
  return normalizeUserConfigResponse(data).pinned_category_ids;
}

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
