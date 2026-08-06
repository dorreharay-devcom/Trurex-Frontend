import { useLayoutEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { likeRex, unlikeRex } from '~/features/discover/api/rexLikesApi';
import { useAuth } from '~/features/auth/providers';
import { patchFeedLike } from '~/features/rex-detail/lib/patchRecommendationCaches';
import type { Recommendation } from '~/shared/types/recommendation';
import { unknownErrorMessage } from '~/shared/lib/data/guards';
import { toastError } from '~/shared/lib/appToast';
import { didAccountFrozenMutationToast } from '~/shared/lib/errors/restriction';
import { assertOnlineForMutation } from '~/shared/lib/network/assertOnline';
import { track, AnalyticsEvent } from '~/shared/lib/analytics/track';

type LikeGate = { id: string; busy: boolean };

export function useLikeRex(rec: Recommendation) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(rec.isLiked);
  const [likes, setLikes] = useState(rec.likes);
  const gate = useRef<LikeGate>({ id: rec.id, busy: false });

  useLayoutEffect(() => {
    gate.current = { id: rec.id, busy: false };
    setLiked(rec.isLiked);
    setLikes(rec.likes);
  }, [rec.id, rec.isLiked, rec.likes]);

  const toggleLike = async () => {
    if (!user) {
      toastError('Sign in required', 'Please sign in to like recommendations.');
      return;
    }
    if (!assertOnlineForMutation('Likes')) return;
    if (gate.current.busy) return;
    gate.current.busy = true;

    const requestRecId = rec.id;
    const wasLiked = liked;
    const wasLikes = likes;
    const nextLiked = !wasLiked;
    const nextLikes = nextLiked ? wasLikes + 1 : Math.max(0, wasLikes - 1);

    setLiked(nextLiked);
    setLikes(nextLikes);
    patchFeedLike(queryClient, requestRecId, nextLiked, nextLikes);

    try {
      if (nextLiked) {
        await likeRex(requestRecId);
      } else {
        await unlikeRex(requestRecId);
      }
      track(AnalyticsEvent.RexLiked, { liked: nextLiked });
    } catch (e) {
      if (gate.current.id !== requestRecId) return;
      setLiked(wasLiked);
      setLikes(wasLikes);
      patchFeedLike(queryClient, requestRecId, wasLiked, wasLikes);
      if (didAccountFrozenMutationToast(e)) return;
      const detail = unknownErrorMessage(e, '').trim();
      if (detail) {
        toastError(detail);
      } else {
        toastError("Couldn't update like", 'Try again.');
      }
    } finally {
      if (gate.current.id === requestRecId) {
        gate.current.busy = false;
      }
    }
  };

  return { liked, likes, toggleLike };
}
