import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, useWindowDimensions, type View } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { followUser } from '~/features/profile/api/followApi';
import { withOnlineMutation } from '~/shared/lib/network/assertOnline';
import { useNotifications } from '~/shared/hooks/useNotifications';
import { NOTIFICATIONS_QUERY_KEY } from '~/shared/config/queryKeys';
import {
  isFollowableNotificationType,
  notificationOpenTarget,
} from '~/shared/lib/notification/helpers';
import { isWeb } from '~/shared/lib/ui/platform';
import type { AppNotification } from '~/shared/types/appNotification';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

const COMPACT_BP = 600;

type Params = {
  onUserPress?: (userId: string) => void;
  onRexPress?: (rexId: string, options?: RecommendationOpenOptions) => void;
};

export function useNotificationBell({ onUserPress, onRexPress }: Params) {
  const { notifications, unreadCount, loading, isError, markAllAsRead, markOneAsRead, refetch } =
    useNotifications();
  const queryClient = useQueryClient();
  const { width, height } = useWindowDimensions();
  const compact = !isWeb || width < COMPACT_BP;

  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);
  const [followedIds, setFollowedIds] = useState(() => new Set<string>());
  const bellRef = useRef<View>(null);
  const slide = useRef(new Animated.Value(height)).current;

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!compact) return;
    Animated.spring(slide, {
      toValue: open ? 0 : height,
      damping: 22,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, [compact, height, open, slide]);

  useEffect(() => {
    if (!isWeb || typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const followMutationFn = withOnlineMutation('Following', followUser);
  const followMutation = useMutation({
    mutationFn: followMutationFn,
    onSuccess: (_data, actorId) => {
      setFollowedIds((prev) => new Set(prev).add(actorId));
      queryClient.setQueryData<AppNotification[]>(
        NOTIFICATIONS_QUERY_KEY,
        (prev) =>
          prev?.map((n) =>
            isFollowableNotificationType(n.type) && n.actor_id === actorId
              ? { ...n, show_followback: false }
              : n,
          ) ?? [],
      );
    },
  });

  const openNotification = useCallback(
    (n: AppNotification) => {
      if (!n.is_read) markOneAsRead(n.id);
      const target = notificationOpenTarget(n);
      if (target?.kind === 'rex' && onRexPress) {
        close();
        onRexPress(target.rexId, target.options);
        return;
      }
      if (target?.kind === 'user' && onUserPress) {
        close();
        onUserPress(target.userId);
      }
    },
    [close, markOneAsRead, onRexPress, onUserPress],
  );

  const openActor = useCallback(
    (userId: string) => {
      if (!onUserPress) return;
      close();
      onUserPress(userId);
    },
    [close, onUserPress],
  );

  const toggle = useCallback(() => {
    if (open) {
      close();
      return;
    }
    bellRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ top: y + h + 8, right: width - x - w });
      setOpen(true);
    });
  }, [close, open, width]);

  return {
    open,
    close,
    toggle,
    compact,
    width,
    height,
    anchor,
    slide,
    bellRef,
    unreadCount,
    loading,
    isError,
    retry: () => void refetch(),
    notifications,
    followedIds,
    followPending: followMutation.isPending,
    markAllAsRead,
    openNotification,
    openActor: onUserPress ? openActor : undefined,
    follow: (actorId: string) => followMutation.mutate(actorId),
  };
}
