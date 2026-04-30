import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { fetchUserConfig } from '~/api/usersApi';
import { useAuth } from '~/services/AuthContext';
import { pinCategory, unpinCategory } from '~/api/pinnedCategoriesApi';

const queryKey = (userId: string) => ['user_config', 'pinned_category_ids', userId] as const;

export function usePinnedCategoryIds() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: userId ? queryKey(userId) : ['user_config', 'pinned_category_ids', 'no-session'],
    queryFn: async () => (await fetchUserConfig()).pinned_category_ids,
    enabled: Boolean(userId),
  });

  const setPinned = useCallback(
    (ids: string[]) => {
      if (userId) {
        queryClient.setQueryData<string[]>(queryKey(userId), ids);
      }
    },
    [queryClient, userId],
  );

  const pinMut = useMutation({
    mutationFn: pinCategory,
    onSuccess: setPinned,
  });
  const unpinMut = useMutation({
    mutationFn: unpinCategory,
    onSuccess: setPinned,
  });

  const togglePin = useCallback(
    (categoryId: string, isPinned: boolean) => {
      if (!userId) return;
      (isPinned ? unpinMut : pinMut).mutate(categoryId);
    },
    [userId, pinMut, unpinMut],
  );

  const pinnedCategoryIds = useMemo(
    () => (userId && query.data ? query.data : []),
    [userId, query.data],
  );
  const isTogglingPin = pinMut.isPending || unpinMut.isPending;

  return { pinnedCategoryIds, isLoading: query.isLoading, togglePin, isTogglingPin };
}
