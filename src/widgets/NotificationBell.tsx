import React from 'react';
import { View, Pressable } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '~/shared/theme/Theme';
import NotificationList from '~/widgets/notifications/NotificationList';
import NotificationPanel from '~/widgets/notifications/NotificationPanel';
import { useNotificationBell } from '~/widgets/hooks/useNotificationBell';
import type { RecommendationOpenOptions } from '~/shared/types/recommendation';

type Props = {
  onUserPress?: (userId: string) => void;
  onRexPress?: (rexId: string, options?: RecommendationOpenOptions) => void;
};

const NotificationBell = ({ onUserPress, onRexPress }: Props) => {
  const insets = useSafeAreaInsets();
  const bell = useNotificationBell({ onUserPress, onRexPress });

  return (
    <>
      <Pressable
        onPress={bell.toggle}
        className="rounded-lg p-2 active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={bell.unreadCount > 0 ? 'Notifications, unread' : 'Notifications'}
      >
        <View ref={bell.bellRef} collapsable={false} className="relative h-5 w-5">
          <Bell size={20} color={Theme.colors.secondaryText} strokeWidth={2} />
          {bell.unreadCount > 0 ? (
            <View
              pointerEvents="none"
              className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-card bg-primary"
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          ) : null}
        </View>
      </Pressable>

      <NotificationPanel
        open={bell.open}
        compact={bell.compact}
        height={bell.height}
        width={bell.width}
        anchor={bell.anchor}
        slide={bell.slide}
        bottomInset={insets.bottom}
        onClose={bell.close}
        onMarkAllRead={() => void bell.markAllAsRead()}
      >
        <NotificationList
          loading={bell.loading}
          notifications={bell.notifications}
          followedIds={bell.followedIds}
          followPending={bell.followPending}
          onOpen={bell.openNotification}
          onOpenActor={bell.openActor}
          onFollow={bell.follow}
        />
      </NotificationPanel>
    </>
  );
};

export default NotificationBell;
