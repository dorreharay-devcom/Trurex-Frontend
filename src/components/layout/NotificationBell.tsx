import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  type ViewStyle,
} from 'react-native';
import { Bell, CheckCheck, ShieldCheck, UserPlus, UserCheck } from 'lucide-react-native';
import { useMutation } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotifications } from '~/hooks/useNotifications';
import { followUser } from '~/api/usersApi';
import { Theme } from '~/theme/Theme';
import { formatCompactRelativeTime } from '~/utils/date';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { ModalToastLayer } from '~/components/toast/ModalToastLayer';

function formatNotificationTime(iso: string): string {
  const c = formatCompactRelativeTime(iso);
  if (!c) return '';
  if (c === 'now') return 'just now';
  return `${c} ago`;
}

const BELL_ICON_SIZE = 20;
const UNREAD_DOT_SIZE = 12;
const UNREAD_DOT_OFFSET = -4;

const typeConfig: Record<string, { verb: string }> = {
  reaction: { verb: 'hearted your Rex' },
  comment: { verb: 'commented on your Rex' },
  comment_reply: { verb: 'replied to your comment' },
  reply: { verb: 'replied to your comment' },
  save: { verb: 'saved your Rex' },
  follow: { verb: 'started following you' },
  following: { verb: 'started following you' },
  new_follower: { verb: 'started following you' },
  follow_request: { verb: 'wants to follow you' },
  follow_request_accepted: { verb: 'accepted your follow request' },
  trusted: { verb: 'is now Trusted' },
  message: { verb: 'sent you a message' },
};

const FOLLOWABLE_TYPES = new Set(['follow', 'following', 'new_follower']);

interface NotificationBellProps {
  onUserPress?: (userId: string) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onUserPress }) => {
  const { notifications, unreadCount, loading, markAllAsRead, markOneAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);
  const bellWrapRef = useRef<View>(null);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  const isMobile = Platform.OS !== 'web' || Dimensions.get('window').width < 600;
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (!isMobile) return;
    if (open) {
      Animated.spring(slideAnim, { toValue: 0, damping: 22, stiffness: 200, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 600, duration: 220, useNativeDriver: true }).start();
    }
  }, [open]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: (_data, actorId) => {
      setFollowedIds((prev) => new Set(prev).add(actorId));
    },
  });

  const close = useCallback(() => setOpen(false), []);

  const openPanel = useCallback(() => {
    bellWrapRef.current?.measureInWindow((x, y, w, h) => {
      const winW = Dimensions.get('window').width;
      setAnchor({ top: y + h + 8, right: winW - x - w });
      setOpen(true);
    });
  }, [markAllAsRead]);

  const toggle = useCallback(() => {
    if (open) {
      setOpen(false);
    } else {
      openPanel();
    }
  }, [open, openPanel]);

  const hasUnread = unreadCount > 0;

  const notificationListContent = loading ? (
    <View className="p-6">
      <Text className="text-center text-sm text-muted-foreground">Loading…</Text>
    </View>
  ) : notifications.length === 0 ? (
    <View className="items-center px-8 py-8">
      <Bell size={32} color={Theme.colors.secondaryText} style={{ opacity: 0.4 }} />
      <Text className="mt-2 text-center text-sm text-muted-foreground">No notifications yet</Text>
    </View>
  ) : (
    <>
      {notifications.map((n) => {
        const cfg = typeConfig[n.type] ?? typeConfig.reaction;
        const actorName =
          n.actor_display_name?.trim() ||
          (n.actor_handle ? `@${n.actor_handle.replace(/^@/, '')}` : null) ||
          'Someone';
        const data = n.data;
        const recTitle =
          data && typeof data.recommendation_title === 'string' ? data.recommendation_title : '';
        const isTrusted = n.type === 'trusted';
        const description =
          n.title ??
          (isTrusted
            ? `${actorName} is now Trusted`
            : recTitle
              ? `${actorName} ${cfg.verb} — ${recTitle}`
              : `${actorName} ${cfg.verb}`);

        return (
          <Pressable
            key={n.id}
            onPress={() => { if (!n.is_read) markOneAsRead(n.id); }}
            className={`flex-row items-start gap-3 border-b border-border/60 px-4 py-3 active:opacity-70 ${!n.is_read ? 'bg-primary/5' : ''}`}
          >
            <Pressable
              onPress={n.actor_id && onUserPress ? () => { close(); onUserPress(n.actor_id!); } : undefined}
              className="shrink-0 active:opacity-70"
            >
              <View className="h-9 w-9 rounded-full overflow-hidden">
                <SignedUserAvatar
                  name={actorName}
                  avatar={n.actor_avatar_url ?? undefined}
                  className="h-9 w-9 border-0"
                />
              </View>
            </Pressable>
            <View className="min-w-0 flex-1">
              <Text className="text-sm text-foreground" numberOfLines={3}>
                {description}
              </Text>
              {FOLLOWABLE_TYPES.has(n.type) && n.actor_id ? (
                followedIds.has(n.actor_id) ? (
                  <View className="mt-1.5 flex-row items-center gap-1 self-start rounded-full border border-border bg-muted px-2.5 py-1">
                    <UserCheck size={11} color={Theme.colors.secondaryText} />
                    <Text className="text-[11px] text-muted-foreground">Following</Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => followMutation.mutate(n.actor_id!)}
                    disabled={followMutation.isPending}
                    className="mt-1.5 flex-row items-center gap-1 self-start rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 active:opacity-70"
                  >
                    <UserPlus size={11} color={Theme.colors.primary} />
                    <Text className="text-[11px] font-medium text-primary">Follow Back</Text>
                  </Pressable>
                )
              ) : null}
              <View className="flex-row items-center gap-2 mt-0.5">
                <Text className="text-xs text-muted-foreground">
                  {formatNotificationTime(n.created_at)}
                </Text>
                {isTrusted && (
                  <View className="flex-row items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5">
                    <ShieldCheck size={10} color={Theme.colors.primary} />
                    <Text className="text-[10px] font-semibold text-primary">Trusted</Text>
                  </View>
                )}
              </View>
            </View>
            {!n.is_read ? (
              <View className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
            ) : (
              <View className="w-2 shrink-0" />
            )}
          </Pressable>
        );
      })}
    </>
  );

  return (
    <>
      <Pressable
        onPress={toggle}
        className="rounded-lg p-2 active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={hasUnread ? 'Notifications, unread' : 'Notifications'}
      >
        <View
          ref={bellWrapRef}
          collapsable={false}
          style={{
            width: BELL_ICON_SIZE,
            height: BELL_ICON_SIZE,
            position: 'relative',
          }}
        >
          <Bell size={BELL_ICON_SIZE} color={Theme.colors.secondaryText} strokeWidth={2} />
          {hasUnread ? (
            <View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  top: UNREAD_DOT_OFFSET,
                  right: UNREAD_DOT_OFFSET,
                  width: UNREAD_DOT_SIZE,
                  height: UNREAD_DOT_SIZE,
                  borderRadius: UNREAD_DOT_SIZE / 2,
                  backgroundColor: Theme.colors.primary,
                  borderWidth: 2,
                  borderColor: Theme.colors.card,
                },
                Platform.OS === 'ios'
                  ? {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 0.5 },
                      shadowOpacity: 0.12,
                      shadowRadius: 1.5,
                    }
                  : null,
                Platform.OS === 'android' ? { elevation: 2 } : null,
                Platform.OS === 'web'
                  ? ({
                      boxShadow: '0 1px 2px rgba(0,0,0,0.14)',
                    } as ViewStyle)
                  : null,
              ]}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          ) : null}
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={close}
        statusBarTranslucent
      >
        <View className="flex-1" style={StyleSheet.absoluteFillObject}>
          <Pressable
            style={[StyleSheet.absoluteFillObject, { backgroundColor: isMobile ? 'rgba(0,0,0,0.4)' : 'transparent' }]}
            onPress={close}
            accessibilityRole="button"
            accessibilityLabel="Close notifications"
          />

          {isMobile ? (
            <Animated.View
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <View className="overflow-hidden rounded-t-2xl border-t border-border bg-card">
                <View className="items-center py-3">
                  <View className="w-10 h-1 rounded-full bg-muted-foreground/30" />
                </View>
                <View className="flex-row items-center justify-between border-b border-border px-4 pb-3">
                  <Text className="text-sm font-semibold text-foreground">Notifications</Text>
                  <Pressable
                    onPress={() => void markAllAsRead()}
                    className="flex-row items-center gap-1 active:opacity-70"
                    accessibilityRole="button"
                    accessibilityLabel="Mark all notifications as read"
                  >
                    <CheckCheck size={14} color={Theme.colors.secondaryText} />
                    <Text className="text-xs text-muted-foreground">Mark all read</Text>
                  </Pressable>
                </View>
                <ScrollView
                  style={{ maxHeight: Dimensions.get('window').height * 0.65 }}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {notificationListContent}
                  <View style={{ height: Math.max(insets.bottom, 16) }} />
                </ScrollView>
              </View>
            </Animated.View>
          ) : anchor ? (
            <View
              pointerEvents="box-none"
              style={{
                position: 'absolute',
                top: anchor.top,
                right: anchor.right,
                width: Math.min(384, Dimensions.get('window').width - 16),
                maxHeight: Dimensions.get('window').height * 0.7,
                zIndex: 10,
              }}
            >
              <View className="overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                <View className="flex-row items-center justify-between border-b border-border px-4 py-3">
                  <Text className="text-sm font-semibold text-foreground">Notifications</Text>
                  <Pressable
                    onPress={() => void markAllAsRead()}
                    className="flex-row items-center gap-1 active:opacity-70"
                    accessibilityRole="button"
                    accessibilityLabel="Mark all notifications as read"
                  >
                    <CheckCheck size={14} color={Theme.colors.secondaryText} />
                    <Text className="text-xs text-muted-foreground">Mark all read</Text>
                  </Pressable>
                </View>
                <ScrollView
                  className="max-h-[420px]"
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {notificationListContent}
                </ScrollView>
              </View>
            </View>
          ) : null}
        </View>
        <ModalToastLayer />
      </Modal>
    </>
  );
};
