import { firstRecord } from '~/shared/lib/data/guards';
import type { UserConfigRow } from '~/shared/types/userConfig';

export function emptyUserConfig(): UserConfigRow {
  return {
    avatar_url: null,
    pinned_category_ids: [],
    status: null,
  };
}

export function toUserConfigRow(data: unknown): UserConfigRow {
  const row = firstRecord(data);
  if (row != null && 'pinned_category_ids' in row) {
    return row as unknown as UserConfigRow;
  }
  return emptyUserConfig();
}
