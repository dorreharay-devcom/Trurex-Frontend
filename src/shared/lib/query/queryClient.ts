import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { StorageService } from '~/shared/lib/storage/kv';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 45_000,
      gcTime: 24 * 60 * 60_000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: 'offlineFirst',
      retry: (failureCount) => onlineManager.isOnline() && failureCount < 2,
    },
    mutations: {
      retry: 0,
      networkMode: 'online',
    },
  },
});

export const queryPersister = createAsyncStoragePersister({
  storage: StorageService,
  key: 'trurex.rq.v1',
  throttleTime: 2_000,
});
