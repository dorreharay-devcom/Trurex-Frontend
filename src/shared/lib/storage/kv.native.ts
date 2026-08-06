import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMMKV, type MMKV } from 'react-native-mmkv';
import type { KeyValueStorage } from '~/shared/lib/storage/kvTypes';

export type { KeyValueStorage } from '~/shared/lib/storage/kvTypes';

const MMKV_ID = 'trurex.kv';
const MIGRATION_FLAG = '__trurex_as_to_mmkv_v1__';

const mmkv: MMKV = createMMKV({ id: MMKV_ID });

let migratePromise: Promise<void> | null = null;

function migrateFromAsyncStorageOnce(): Promise<void> {
  if (migratePromise) return migratePromise;
  if (mmkv.getBoolean(MIGRATION_FLAG)) {
    migratePromise = Promise.resolve();
    return migratePromise;
  }

  migratePromise = (async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await Promise.all(
        keys.map(async (key) => {
          if (key === MIGRATION_FLAG) return;
          if (mmkv.contains(key)) return;
          const value = await AsyncStorage.getItem(key);
          if (value != null) mmkv.set(key, value);
        }),
      );
    } catch (e) {
      console.warn('[storage] AsyncStorage → MMKV migration failed', e);
    } finally {
      mmkv.set(MIGRATION_FLAG, true);
    }
  })();

  return migratePromise;
}

async function ready(): Promise<void> {
  await migrateFromAsyncStorageOnce();
}

export const StorageService: KeyValueStorage = {
  getItem: async (key) => {
    await ready();
    return mmkv.getString(key) ?? null;
  },
  setItem: async (key, value) => {
    await ready();
    mmkv.set(key, value);
  },
  removeItem: async (key) => {
    await ready();
    mmkv.remove(key);
  },
};
