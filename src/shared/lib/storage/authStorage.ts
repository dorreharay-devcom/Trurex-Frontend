import type { KeyValueStorage } from '~/shared/lib/storage/kvTypes';
import { StorageService } from '~/shared/lib/storage/kv';

export const AuthStorage: KeyValueStorage = StorageService;
