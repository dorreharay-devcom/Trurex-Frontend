import { useCallback } from 'react';
import { toastError } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { unknownErrorMessage } from '~/shared/lib/data/guards';

export async function runCommentMutation(
  failTitle: string,
  action: () => Promise<void>,
): Promise<boolean> {
  try {
    await action();
    return true;
  } catch (e) {
    if (!didAccountFrozenMutationToast(e)) {
      toastError(failTitle, unknownErrorMessage(e, 'Try again.'));
    }
    return false;
  }
}

type Params = {
  canLike: boolean;
  deleteComment: (commentId: string) => Promise<void>;
  toggleCommentLike: (commentId: string, currentlyLiked: boolean) => Promise<void>;
};

export function useCommentActions({ canLike, deleteComment, toggleCommentLike }: Params) {
  const handleDelete = useCallback(
    async (commentId: string) => {
      await runCommentMutation('Delete failed', () => deleteComment(commentId));
    },
    [deleteComment],
  );

  const handleToggleLike = useCallback(
    async (commentId: string, currentlyLiked: boolean) => {
      if (!canLike) return;
      await runCommentMutation('Could not update like', () =>
        toggleCommentLike(commentId, currentlyLiked),
      );
    },
    [canLike, toggleCommentLike],
  );

  return { handleDelete, handleToggleLike };
}
