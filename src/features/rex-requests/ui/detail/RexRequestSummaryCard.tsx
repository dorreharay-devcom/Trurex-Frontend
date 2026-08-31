import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Check, MapPin, Share2 } from 'lucide-react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import { formatCompactRelativeTime } from '~/shared/lib/data/date';
import { needByLabel } from '~/features/rex-requests/config/needBy';
import { Theme } from '~/shared/theme/Theme';
import type { RexRequestRow } from '~/features/rex-requests/api/types';

type Props = {
  request: RexRequestRow;
  onSharePress: () => void;
  onRequesterPress?: () => void;
  showResolve?: boolean;
  resolving?: boolean;
  onResolvePress?: () => void;
};

function RexRequestSummaryCard({
  request,
  onSharePress,
  onRequesterPress,
  showResolve = false,
  resolving = false,
  onResolvePress,
}: Props) {
  const audience = [...(request.is_public ? ['Public'] : []), ...request.circle_names];

  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <View className="flex-row items-center gap-3 p-4 pb-3">
        <TouchableOpacity
          onPress={onRequesterPress}
          activeOpacity={0.7}
          disabled={!onRequesterPress}
        >
          <SignedUserAvatar
            name={request.requester_display_name ?? 'Member'}
            avatar={request.requester_avatar_url}
            sizePt={36}
          />
        </TouchableOpacity>
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {request.requester_display_name ?? 'Member'}
          </Text>
          <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={1}>
            {request.requester_handle ? `@${request.requester_handle} · ` : ''}
            {formatCompactRelativeTime(request.created_at)}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          {showResolve ? (
            <TouchableOpacity
              onPress={onResolvePress}
              disabled={resolving}
              accessibilityRole="button"
              accessibilityLabel="Mark as resolved"
              className="flex-row items-center gap-1.5 rounded-full bg-primary px-3 py-1.5"
            >
              {resolving ? (
                <ActivityIndicator size="small" color={Theme.colors.primaryForeground} />
              ) : (
                <Check size={14} color={Theme.colors.primaryForeground} />
              )}
              <Text className="text-xs font-semibold text-primary-foreground">Mark Resolved</Text>
            </TouchableOpacity>
          ) : request.status === 'resolved' ? (
            <View className="flex-row items-center gap-1.5 rounded-full bg-primary/25 px-3 py-1.5">
              <Check size={14} color={Theme.colors.foreground} />
              <Text className="text-xs font-semibold text-foreground">Resolved</Text>
            </View>
          ) : null}
          <TouchableOpacity
            onPress={onSharePress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Share this request"
          >
            <Share2 size={18} color={Theme.colors.secondaryText} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row flex-wrap items-center gap-2 px-4 pb-2">
        <View className="rounded-full border border-border bg-muted/50 px-2.5 py-1">
          <Text className="text-xs font-medium text-black">
            {request.category_icon} {request.category_name}
          </Text>
        </View>
      </View>

      <View className="px-4 pb-2">
        <Text className="font-display text-lg font-bold text-foreground">
          {request.looking_for_text}
        </Text>
        {request.location_text ? (
          <View className="mt-1.5 flex-row items-center gap-1">
            <MapPin size={12} color={Theme.colors.secondaryText} />
            <Text className="flex-1 text-xs text-muted-foreground">{request.location_text}</Text>
          </View>
        ) : null}
      </View>

      {request.note ? (
        <Text className="px-4 pb-3 text-sm leading-5 text-foreground opacity-85">
          {request.note}
        </Text>
      ) : null}

      <View className="border-t border-border bg-muted/30 px-4 py-3">
        <Text className="mb-1 text-xs leading-5 text-muted-foreground">
          Need by:{' '}
          <Text className="font-medium text-foreground">{needByLabel(request.need_by)}</Text>
        </Text>
        <Text className="text-xs leading-5 text-muted-foreground">
          Sharing to:{' '}
          <Text className="font-medium text-foreground">
            {audience.length ? audience.join(', ') : 'No one yet'}
          </Text>
        </Text>
      </View>
    </View>
  );
}

export default RexRequestSummaryCard;
