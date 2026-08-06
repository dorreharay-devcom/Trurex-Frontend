import type { KeyValueStorage } from '~/shared/lib/storage/kvTypes';

export type { KeyValueStorage } from '~/shared/lib/storage/kvTypes';

export const StorageService: KeyValueStorage = {
  getItem: async (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem: async (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};
