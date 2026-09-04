import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Clock, MapPin, MessageCircle, Tag } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import { formatCompactRelativeTime } from '~/shared/lib/data/date';
import { needByLabel } from '~/features/rex-requests/config/needBy';
import { cn } from '~/shared/lib/ui/styles';
import type { RexRequestRow } from '~/features/rex-requests/api/types';

type Props = {
  request: RexRequestRow;
  onPress?: () => void;
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <View className="self-start rounded-full border border-border/80 bg-border/40 px-2 py-0.5">
      <Text className="text-xs font-medium text-foreground">{children}</Text>
    </View>
  );
}

const RexRequestCard = memo(function RexRequestCard({ request, onPress }: Props) {
  const audience = [...(request.is_public ? ['Public'] : []), ...(request.circle_names ?? [])];
  const hasRequesterInfo = Boolean(request.requester_display_name);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
      className={cn(
        'rounded-xl border border-border bg-card p-4',
        request.status === 'resolved' && 'opacity-60',
      )}
    >
      <View className="mb-3 flex-row items-center gap-2.5">
        {hasRequesterInfo ? (
          <>
            <SignedUserAvatar
              name={request.requester_display_name!}
              avatar={request.requester_avatar_url}
              sizePt={32}
            />
            <View className="min-w-0 flex-1">
              <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                {request.requester_display_name}
              </Text>
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                @{request.requester_handle} · {formatCompactRelativeTime(request.created_at)}
                {request.status === 'resolved' ? (
                  <Text className="font-semibold text-foreground"> · Resolved</Text>
                ) : null}
              </Text>
            </View>
          </>
        ) : (
          <View className="min-w-0 flex-1 flex-row items-center gap-2.5">
            <View
              className="h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: `${Theme.colors.primary}26` }}
            >
              <Clock size={16} color={Theme.colors.primary} />
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
                Your request
              </Text>
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>
                Posted {formatCompactRelativeTime(request.created_at)} ago
                {request.status === 'resolved' ? (
                  <Text className="font-semibold text-foreground"> · Resolved</Text>
                ) : null}
              </Text>
            </View>
          </View>
        )}
        {request.categories.length > 0 ? (
          <View className="flex-row items-center gap-1">
            <Pill>
              {request.categories[0]!.icon} {request.categories[0]!.name}
            </Pill>
            {request.categories.length > 1 ? <Pill>+{request.categories.length - 1}</Pill> : null}
          </View>
        ) : null}
      </View>

      <Text className="text-sm text-foreground" numberOfLines={2}>
        {request.looking_for_text}
      </Text>

      {request.location_text ? (
        <View className="mt-2 flex-row items-center gap-1.5">
          <MapPin size={13} color={Theme.colors.secondaryText} />
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {request.location_text}
          </Text>
        </View>
      ) : null}

      <View className="mt-3 flex-row flex-wrap items-center gap-1.5">
        <Pill>Need by: {needByLabel(request.need_by)}</Pill>
        {audience.map((title) => (
          <Pill key={title}>{title}</Pill>
        ))}
      </View>

      <View className="mt-3 flex-row items-center gap-4 border-t border-border pt-3">
        <View className="flex-row items-center gap-1.5">
          <Tag size={14} color={Theme.colors.secondaryText} />
          <Text className="text-xs text-muted-foreground">{request.response_count}</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <MessageCircle size={14} color={Theme.colors.secondaryText} />
          <Text className="text-xs text-muted-foreground">{request.comment_count}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default RexRequestCard;
