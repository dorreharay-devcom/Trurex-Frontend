import React from 'react';
import { View, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import NotificationRow from '~/widgets/notifications/NotificationRow';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import type { AppNotification } from '~/shared/types/appNotification';

type Props = {
  loading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  notifications: AppNotification[];
  followedIds: Set<string>;
  followPending: boolean;
  onOpen: (n: AppNotification) => void;
  onOpenActor?: (userId: string) => void;
  onFollow?: (actorId: string) => void;
};

const NotificationList = ({
  loading,
  isError,
  onRetry,
  notifications,
  followedIds,
  followPending,
  onOpen,
  onOpenActor,
  onFollow,
}: Props) => {
  if (loading && notifications.length === 0) {
    return (
      <View className="p-6">
        <Text className="text-center text-sm text-muted-foreground">Loading…</Text>
      </View>
    );
  }

  if (isError && notifications.length === 0) {
    return (
      <View className="px-4 py-6">
        <QueryErrorState title="Couldn't load notifications" onRetry={onRetry} />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View className="items-center px-8 py-8">
        <Bell size={32} color={Theme.colors.secondaryText} style={{ opacity: 0.4 }} />
        <Text className="mt-2 text-center text-sm text-muted-foreground">No notifications yet</Text>
      </View>
    );
  }

  return (
    <>
      {notifications.map((n) => (
        <NotificationRow
          key={n.id}
          n={n}
          followed={Boolean(n.actor_id && followedIds.has(n.actor_id))}
          followPending={followPending}
          onOpen={() => onOpen(n)}
          onOpenActor={n.actor_id && onOpenActor ? () => onOpenActor(n.actor_id!) : undefined}
          onFollow={n.actor_id && onFollow ? () => onFollow(n.actor_id!) : undefined}
        />
      ))}
    </>
  );
};

export default NotificationList;
