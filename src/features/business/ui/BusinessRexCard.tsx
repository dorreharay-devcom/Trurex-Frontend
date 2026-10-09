import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Inbox, Star } from 'lucide-react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import CardTags from '~/features/discover/ui/feed/common/CardTags';
import BusinessRexCardMedia from '~/features/business/ui/BusinessRexCardMedia';
import { averagePlaceRexScore } from '~/features/business/lib/placeRexRating';
import { Theme } from '~/shared/theme/Theme';
import type { PlaceRexRow } from '~/features/business/types/placeRex';

export const BUSINESS_REX_CARD_WIDTH = 260;
const BUSINESS_REX_CARD_HEIGHT = 360;

type Props = {
  row: PlaceRexRow;
  categoryIcon?: string | null;
  onPress: () => void;
};

function BusinessRexCard({ row, categoryIcon, onPress }: Props) {
  const score = averagePlaceRexScore(row.category_ratings);
  const hasContent = Boolean(row.review) || row.tag_slugs.length > 0;

  return (
    <Pressable
      onPress={onPress}
      style={{ width: BUSINESS_REX_CARD_WIDTH, height: BUSINESS_REX_CARD_HEIGHT, flexShrink: 0 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-card active:opacity-90"
    >
      <BusinessRexCardMedia photoPath={row.photo_paths[0] ?? null} categoryIcon={categoryIcon} />
      <View className="flex-1 gap-2 p-3">
        <View className="flex-row items-center gap-2">
          <SignedUserAvatar
            name={row.author_display_name}
            avatar={row.author_avatar_url}
            verified={row.author_verified}
            className="h-7 w-7"
            sizePt={28}
          />
          <Text className="min-w-0 flex-1 text-sm font-semibold text-foreground" numberOfLines={1}>
            {row.author_display_name}
          </Text>
          {score != null ? (
            <View className="flex-row shrink-0 items-center gap-1">
              <Star size={13} color={Theme.colors.ratingStar} fill={Theme.colors.ratingStar} />
              <Text className="text-sm font-semibold text-foreground">{score.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
        {hasContent ? (
          <View className="flex-1 justify-center gap-2">
            {row.review ? (
              <Text className="text-xs text-foreground/80" numberOfLines={2}>
                {row.review}
              </Text>
            ) : null}
            <View className="-mx-4">
              <CardTags tags={row.tag_slugs} />
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center gap-1.5">
            <Inbox size={22} color={Theme.colors.muted} />
            <Text className="text-sm font-medium text-muted-foreground">Nothing added yet</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default BusinessRexCard;
