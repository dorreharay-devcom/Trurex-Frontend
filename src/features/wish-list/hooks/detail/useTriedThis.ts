import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import { WishListApi } from '~/features/wish-list/api/wishListApi';
import type { WishListItemRow } from '~/features/wish-list/api/types';
import { buildAddYourOwnRecSourceFromWishListItem } from '~/features/wish-list/lib/tryThisPrefill';
import { toastError } from '~/shared/lib/appToast';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';

type Args = {
  item: WishListItemRow | null;
  onNavigateToCreateRex: (source: AddYourOwnRecSource) => void;
  onDeleted: () => void;
};

export function useTriedThis({ item, onNavigateToCreateRex, onDeleted }: Args) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutationFn = withOnlineMutation('Deleting', WishListApi.deleteWishListItem);
  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
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
    onNavigateToCreateRex(buildAddYourOwnRecSourceFromWishListItem(item));
    mutation.mutate(item.id);
  }, [item, onNavigateToCreateRex, mutation]);

  const confirmNo = useCallback(() => {
    setConfirmOpen(false);
    if (!item) return;
    mutation.mutate(item.id);
  }, [item, mutation]);

  return { confirmOpen, open, close, confirmYes, confirmNo, pending: mutation.isPending };
}

export type TriedThisState = ReturnType<typeof useTriedThis>;
