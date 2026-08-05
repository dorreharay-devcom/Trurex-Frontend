import * as SecureStore from 'expo-secure-store';
import type { KeyValueStorage } from '~/shared/lib/storage/kvTypes';
import { StorageService } from '~/shared/lib/storage/kv';

const CHUNK = 1800;
const CHUNK_COUNT_SUFFIX = '__chunk_count';

async function getChunkCount(key: string): Promise<number | null> {
  const raw = await SecureStore.getItemAsync(`${key}${CHUNK_COUNT_SUFFIX}`);
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

async function setChunked(key: string, value: string): Promise<void> {
  const parts = Math.ceil(value.length / CHUNK);
  await SecureStore.setItemAsync(`${key}${CHUNK_COUNT_SUFFIX}`, String(parts));
  for (let i = 0; i < parts; i += 1) {
    await SecureStore.setItemAsync(`${key}__${i}`, value.slice(i * CHUNK, (i + 1) * CHUNK));
  }
  await SecureStore.deleteItemAsync(key).catch(() => undefined);
}

async function getChunked(key: string, parts: number): Promise<string | null> {
  const chunks: string[] = [];
  for (let i = 0; i < parts; i += 1) {
    const part = await SecureStore.getItemAsync(`${key}__${i}`);
    if (part == null) return null;
    chunks.push(part);
  }
  return chunks.join('');
}

async function removeChunked(key: string, parts: number): Promise<void> {
  await SecureStore.deleteItemAsync(`${key}${CHUNK_COUNT_SUFFIX}`).catch(() => undefined);
  await SecureStore.deleteItemAsync(key).catch(() => undefined);
  await Promise.all(
    Array.from({ length: parts }, (_, i) =>
      SecureStore.deleteItemAsync(`${key}__${i}`).catch(() => undefined),
    ),
  );
}

async function writeSecure(key: string, value: string): Promise<void> {
  if (value.length <= CHUNK) {
    const oldParts = await getChunkCount(key);
    if (oldParts != null) await removeChunked(key, oldParts);
    await SecureStore.setItemAsync(key, value);
    return;
  }
  await setChunked(key, value);
}

async function migrateFromInsecureOnce(key: string): Promise<string | null> {
  const legacy = await StorageService.getItem(key);
  if (legacy == null) return null;
  await writeSecure(key, legacy);
  await StorageService.removeItem(key).catch(() => undefined);
  return legacy;
}

export const AuthStorage: KeyValueStorage = {
  getItem: async (key) => {
    const parts = await getChunkCount(key);
    if (parts != null) {
      const value = await getChunked(key, parts);
      if (value != null) return value;
    }
    const single = await SecureStore.getItemAsync(key);
    if (single != null) return single;
    return migrateFromInsecureOnce(key);
  },
  setItem: writeSecure,
  removeItem: async (key) => {
    const parts = await getChunkCount(key);
    if (parts != null) {
      await removeChunked(key, parts);
      return;
    }
    await SecureStore.deleteItemAsync(key).catch(() => undefined);
    await StorageService.removeItem(key).catch(() => undefined);
  },
};
