import { useEffect, useRef, useState } from 'react';
import { likeRex, unlikeRex } from '~/features/discover/api/rexLikesApi';
import { useAuth } from '~/features/auth/providers';
import type { Recommendation } from '~/shared/types/recommendation';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { toastError } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';

export function useLikeRex(rec: Recommendation) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(rec.isLiked);
  const [likes, setLikes] = useState(rec.likes);
  const busy = useRef(false);

  useEffect(() => {
    setLiked(rec.isLiked);
    setLikes(rec.likes);
  }, [rec.id, rec.isLiked, rec.likes]);

  const toggleLike = async () => {
    if (!user) {
      toastError('Sign in required', 'Please sign in to like recommendations.');
      return;
    }
    if (busy.current) return;
    busy.current = true;

    const wasLiked = liked;
    const nextLiked = !wasLiked;
    setLiked(nextLiked);
    setLikes((n) => (nextLiked ? n + 1 : n - 1));

    try {
      if (nextLiked) {
        await likeRex(rec.id);
      } else {
        await unlikeRex(rec.id);
      }
    } catch (e) {
      setLiked(wasLiked);
      setLikes((n) => (nextLiked ? n - 1 : n + 1));
      if (didAccountFrozenMutationToast(e)) return;
      const detail = unknownErrorMessage(e, '').trim();
      if (detail) {
        toastError(detail);
      } else {
        toastError("Couldn't update like", 'Try again.');
      }
    } finally {
      busy.current = false;
    }
  };

  return { liked, likes, toggleLike };
}
