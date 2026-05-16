import React from 'react';
import { View, Text } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { useCategoryIcon } from '~/hooks/useCategoryIcon';
import type {
  ConfirmAuthorPreview,
  ConfirmPreviewPlace,
} from '~/utils/recommendation/recCreateFlow';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';

const TAGS_PREVIEW_MAX = 5;

type Props = {
  author: ConfirmAuthorPreview;
  place: ConfirmPreviewPlace;
  selectedCategoryId: string | null;
  categoryDisplayName: string | null;
  subcategoryLabel: string | null;
  photoCount: number;
  ratingDisplay: string | null;
  tagLabels: string[];
  tip: string;
  review: string;
  circleTitles: string[];
};

export function ConfirmPreviewCard({
  author,
  place,
  selectedCategoryId,
  categoryDisplayName,
  subcategoryLabel,
  photoCount,
  ratingDisplay,
  tagLabels,
  tip,
  review,
  circleTitles,
}: Props) {
  const categoryEmoji = useCategoryIcon(selectedCategoryId);
  const categoryLabel = categoryDisplayName?.trim() || 'Category';
  const sharingLine = circleTitles.length > 0 ? circleTitles.join(', ') : 'No one yet';

  return (
    <View className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <View className="flex-row items-center gap-3 p-4 pb-3">
        <View className="h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-sand">
          <Text className="text-xs font-semibold text-sand-dark">{author.initials}</Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground">{author.name}</Text>
          <Text className="mt-0.5 text-xs text-muted-foreground">
            {author.handle ? `${author.handle} · ` : ''}just now
          </Text>
        </View>
        {selectedCategoryId ? (
          <View className="max-w-[52%] shrink-0 rounded-full border border-border bg-muted/50 px-2.5 py-1">
            <Text className="text-xs font-medium text-black" numberOfLines={2}>
              {categoryEmoji} {categoryLabel}
              {subcategoryLabel ? ` · ${subcategoryLabel}` : ''}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="px-4 pb-2">
        <Text className="font-display text-lg font-bold text-foreground">{place.title}</Text>
        {place.addressLines.map((line) => (
          <View key={line} className="mt-0.5 flex-row items-center gap-1">
            <MapPin size={12} color={Theme.colors.secondaryText} />
            <Text className="flex-1 text-xs text-muted-foreground">{line}</Text>
          </View>
        ))}
      </View>

      {tip.length > 0 ? (
        <View className="mx-4 mb-3 rounded-lg border-l-4 border-primary bg-accent p-3">
          <Text className="text-sm italic text-foreground">&quot;{tip}&quot;</Text>
        </View>
      ) : null}

      {ratingDisplay != null ? (
        <View className="flex-row items-center gap-1.5 px-4 pb-2">
          <Star
            size={14}
            color={Theme.colors.ratingStar}
            fill={Theme.colors.ratingStar}
          />
          <Text className="text-sm font-semibold text-foreground">{ratingDisplay}</Text>
        </View>
      ) : null}

      {tagLabels.length > 0 ? (
        <View className="flex-row flex-wrap gap-1.5 px-4 pb-2">
          {tagLabels.slice(0, TAGS_PREVIEW_MAX).map((label, i) => (
            <View
              key={`${label}-${i}`}
              className="rounded-full border border-border bg-muted/50 px-2 py-0.5"
            >
              <Text className="text-xs text-black">{label}</Text>
            </View>
          ))}
          {tagLabels.length > TAGS_PREVIEW_MAX ? (
            <View className="rounded-full border border-border bg-muted/50 px-2 py-0.5">
              <Text className="text-xs text-black">
                +{tagLabels.length - TAGS_PREVIEW_MAX} more
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {review.length > 0 ? (
        <Text className={cn('px-4 pb-3 text-sm leading-5 text-foreground opacity-85')}>
          {review}
        </Text>
      ) : null}

      <View className="border-t border-border bg-muted/30 px-4 py-3">
        {photoCount > 0 ? (
          <Text className="mb-1 text-xs leading-5 text-muted-foreground">
            Photos: <Text className="font-medium text-foreground">{photoCount}</Text>
          </Text>
        ) : null}
        <Text className="text-xs leading-5 text-muted-foreground">
          Sharing to: <Text className="font-medium text-foreground">{sharingLine}</Text>
        </Text>
      </View>
    </View>
  );
}
