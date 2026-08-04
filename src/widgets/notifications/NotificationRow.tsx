import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ShieldCheck, UserPlus, UserCheck } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { NOTIFICATION_TYPE } from '~/shared/config/notificationTypes';
import {
  canShowFollowBack,
  notificationActorLabel,
  notificationDescription,
  notificationRelativeTime,
} from '~/shared/lib/notification/helpers';
import { cn } from '~/shared/lib/ui/styles';
import { SignedUserAvatar } from '~/shared/ui/SignedUserAvatar';
import type { AppNotification } from '~/shared/types/appNotification';

type Props = {
  n: AppNotification;
  followed: boolean;
  followPending: boolean;
  onOpen: () => void;
  onOpenActor?: () => void;
  onFollow?: () => void;
};

const FollowChip = ({
  followed,
  followPending,
  onFollow,
}: {
  followed: boolean;
  followPending: boolean;
  onFollow: () => void;
}) => {
  if (followed) {
    return (
      <View className="mt-1.5 flex-row items-center gap-1 self-start rounded-full border border-border bg-muted px-2.5 py-1">
        <UserCheck size={11} color={Theme.colors.secondaryText} />
        <Text className="text-[11px] text-muted-foreground">Following</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={onFollow}
      disabled={followPending}
      className="mt-1.5 flex-row items-center gap-1 self-start rounded-full border border-border/80 bg-border/40 px-2.5 py-1 active:opacity-70"
    >
      <UserPlus size={11} color={Theme.colors.foreground} />
      <Text className="text-[11px] font-medium text-foreground">Follow Back</Text>
    </Pressable>
  );
};

const NotificationRow = ({ n, followed, followPending, onOpen, onOpenActor, onFollow }: Props) => {
  const showFollow = canShowFollowBack(n);
  const name = notificationActorLabel(n);
  const canShowFollowChip = Boolean((showFollow || followed) && onFollow);

  return (
    <Pressable
      onPress={onOpen}
      className={cn(
        'flex-row items-start gap-3 border-b border-border/60 px-4 py-3 active:opacity-70',
        !n.is_read && 'bg-primary/5',
      )}
    >
      <Pressable
        onPress={onOpenActor}
        disabled={!onOpenActor}
        className="shrink-0 active:opacity-70"
      >
        <SignedUserAvatar name={name} avatar={n.actor_avatar_url} className="h-9 w-9 border-0" />
      </Pressable>

      <View className="min-w-0 flex-1">
        <Text className="text-sm text-foreground" numberOfLines={3}>
          {notificationDescription(n)}
        </Text>

        {canShowFollowChip ? (
          <FollowChip followed={followed} followPending={followPending} onFollow={onFollow!} />
        ) : null}

        <View className="mt-0.5 flex-row items-center gap-2">
          <Text className="text-xs text-muted-foreground">
            {notificationRelativeTime(n.created_at)}
          </Text>
          {n.type === NOTIFICATION_TYPE.trusted ? (
            <View className="flex-row items-center gap-1 rounded-full border border-border/80 bg-border/40 px-2 py-0.5">
              <ShieldCheck size={10} color={Theme.colors.foreground} />
              <Text className="text-[10px] font-semibold text-foreground">Trusted</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View className={cn('mt-2 h-2 w-2 shrink-0 rounded-full', !n.is_read && 'bg-primary')} />
    </Pressable>
  );
};

export default NotificationRow;
