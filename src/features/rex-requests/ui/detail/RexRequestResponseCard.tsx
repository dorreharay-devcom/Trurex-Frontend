import React from 'react';
import { ActivityIndicator, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, Star, X } from 'lucide-react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import { formatCompactRelativeTime } from '~/shared/lib/data/date';
import { Theme } from '~/shared/theme/Theme';
import type { RexRequestResponseRow } from '~/features/rex-requests/api/types';

type Props = {
  response: RexRequestResponseRow;
  onPress: () => void;
  canUntag?: boolean;
  untagging?: boolean;
  onUntag?: () => void;
};

function RexRequestResponseCard({
  response,
  onPress,
  canUntag = false,
  untagging = false,
  onUntag,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-3"
    >
      <SignedUserAvatar
        name={response.responder_display_name}
        avatar={response.responder_avatar_url}
        sizePt={32}
      />
      <View className="min-w-0 flex-1">
        <Text className="text-xs text-muted-foreground" numberOfLines={1}>
          {response.responder_display_name} tagged ·{' '}
          {formatCompactRelativeTime(response.responded_at)}
        </Text>
        <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
          {response.rex_place_name}
        </Text>
        <View className="mt-0.5 flex-row items-center gap-2">
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {response.rex_category_name}
          </Text>
          {response.rex_overall_rating != null ? (
            <View className="flex-row items-center gap-1">
              <Star size={11} color={Theme.colors.ratingStar} fill={Theme.colors.ratingStar} />
              <Text className="text-xs font-medium text-foreground">
                {response.rex_overall_rating.toFixed(1)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      {canUntag ? (
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onUntag?.();
          }}
          disabled={untagging}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Untag this Rex"
          className="h-8 w-8 items-center justify-center rounded-full active:opacity-70"
        >
          {untagging ? (
            <ActivityIndicator size="small" color={Theme.colors.secondaryText} />
          ) : (
            <X size={16} color={Theme.colors.secondaryText} />
          )}
        </Pressable>
      ) : (
        <ChevronRight size={16} color={Theme.colors.secondaryText} />
      )}
    </TouchableOpacity>
  );
}

export default RexRequestResponseCard;
