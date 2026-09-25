import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { WishListApi } from '~/features/wish-list/api/wishListApi';
import { WISH_LIST_QUERY_KEYS } from '~/features/wish-list/config/queryKeys';
import { toastError, toastSuccess } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';

type Args = {
  itemId: string | null;
  visible: boolean;
  onDeleted: () => void;
};

export function useDeleteWishListItem({ itemId, visible, onDeleted }: Args) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!visible) setConfirmOpen(false);
  }, [visible]);

  const mutationFn = withOnlineMutation('Deleting', WishListApi.deleteWishListItem);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      setConfirmOpen(false);
      toastSuccess('Removed from Wish List');
      void queryClient.invalidateQueries({ queryKey: WISH_LIST_QUERY_KEYS.mine });
      onDeleted();
    },
    onError: (err: unknown) => {
      if (didAccountFrozenMutationToast(err)) return;
      toastError('Could not delete', unknownErrorMessage(err, 'Try again.'));
    },
  });

  const openConfirm = useCallback(() => setConfirmOpen(true), []);
  const closeConfirm = useCallback(() => setConfirmOpen(false), []);
  const confirmDelete = useCallback(() => {
    if (!itemId) return;
    mutation.mutate(itemId);
  }, [itemId, mutation]);

  return { confirmOpen, openConfirm, closeConfirm, confirmDelete, pending: mutation.isPending };
}

export type DeleteWishListItemState = ReturnType<typeof useDeleteWishListItem>;
