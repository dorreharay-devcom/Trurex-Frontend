import { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import { WishListApi } from '~/features/wish-list/api/wishListApi';
import { WISH_LIST_QUERY_KEYS } from '~/features/wish-list/config/queryKeys';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import { buildAddYourOwnRecSourceFromWishListItem } from '~/features/wish-list/lib/tryThisPrefill';
import { toastError } from '~/shared/lib/appToast';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';

type Args = {
  item: WishListItemRow | null;
  onNavigateToCreateRex: (source: AddYourOwnRecSource) => void;
  onConfirm?: () => void;
  onDeleted: () => void;
};

export function useTriedThis({ item, onNavigateToCreateRex, onConfirm, onDeleted }: Args) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutationFn = withOnlineMutation('Deleting', WishListApi.deleteWishListItem);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WISH_LIST_QUERY_KEYS.mine });
      void queryClient.invalidateQueries({ queryKey: WISH_LIST_QUERY_KEYS.profilePreviewBase });
      onDeleted();
    },
    onError: (err: unknown) => {
      toastError('Could not delete', unknownErrorMessage(err, 'Try again.'));
    },
  });

  const open = useCallback(() => setConfirmOpen(true), []);
  const close = useCallback(() => setConfirmOpen(false), []);

  const confirmYes = useCallback(() => {
    setConfirmOpen(false);
    if (!item) return;
    onConfirm?.();
    onNavigateToCreateRex(buildAddYourOwnRecSourceFromWishListItem(item));
    mutation.mutate(item.id);
  }, [item, onConfirm, onNavigateToCreateRex, mutation]);

  const confirmNo = useCallback(() => {
    setConfirmOpen(false);
    if (!item) return;
    onConfirm?.();
    mutation.mutate(item.id);
  }, [item, onConfirm, mutation]);

  return { confirmOpen, open, close, confirmYes, confirmNo, pending: mutation.isPending };
}

export type TriedThisState = ReturnType<typeof useTriedThis>;
