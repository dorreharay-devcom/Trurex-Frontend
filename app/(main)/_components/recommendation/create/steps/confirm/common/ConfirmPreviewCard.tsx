import React from 'react';
import { View, Text } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { getRexCategoryById } from '~/constants/recommendation/rexCategories';
import {
  CONFIRM_PREVIEW_USER,
  type ConfirmPreviewPlace,
} from '~/utils/recommendation/confirmPreview';
import { Theme } from '~/theme/Theme';

type Props = {
  place: ConfirmPreviewPlace;
  selectedCategoryId: string | null;
  ratingDisplay: string | null;
  appliesLabels: string[];
  tip: string;
  review: string;
  circleTitles: string[];
};

export function ConfirmPreviewCard({
  place,
  selectedCategoryId,
  ratingDisplay,
  appliesLabels,
  tip,
  review,
  circleTitles,
}: Props) {
  const category = getRexCategoryById(selectedCategoryId ?? '');

  return (
    <View className="mt-5 rounded-[12px] border border-border bg-card overflow-hidden">
      <View className="flex-row items-start gap-3 p-4 pb-3">
        <View className="h-10 w-10 rounded-full border border-border bg-sand items-center justify-center">
          <Text className="text-sm font-semibold text-sand-dark">
            {CONFIRM_PREVIEW_USER.initials}
          </Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground">{CONFIRM_PREVIEW_USER.name}</Text>
          <Text className="text-xs text-muted mt-0.5">
            {CONFIRM_PREVIEW_USER.handle} · just now
          </Text>
        </View>
        {category && (
          <View className="max-w-[52%] shrink-0 rounded-full bg-muted px-2.5 py-1">
            <Text className="text-xs font-medium text-foreground" numberOfLines={2}>
              {category.emoji} {category.label}
            </Text>
          </View>
        )}
      </View>

      <View className="px-4 pb-3">
        <Text className="text-lg font-bold text-foreground leading-6">{place.title}</Text>
        {place.addressLines.map((line) => (
          <View key={line} className="mt-1.5 flex-row items-start gap-1.5">
            <MapPin size={14} color={Theme.colors.muted} style={{ marginTop: 2 }} />
            <Text className="flex-1 text-sm text-muted leading-5">{line}</Text>
          </View>
        ))}
        {ratingDisplay != null && (
          <View className="mt-2 flex-row items-center gap-1">
            <Star
              size={16}
              color={Theme.colors.accentForeground}
              fill={Theme.colors.accentForeground}
            />
            <Text className="text-sm font-medium text-foreground">{ratingDisplay}</Text>
          </View>
        )}
      </View>

      {appliesLabels.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5 px-4 pb-3">
          {appliesLabels.map((label) => (
            <View key={label} className="rounded-full bg-muted px-2.5 py-1">
              <Text className="text-xs font-medium text-foreground">{label}</Text>
            </View>
          ))}
        </View>
      )}

      {(tip.length > 0 || review.length > 0) && (
        <View className="px-4 pb-3 gap-2">
          {tip.length > 0 && (
            <Text className="text-sm text-foreground leading-5">
              <Text className="font-semibold">Quick tip: </Text>
              {tip}
            </Text>
          )}
          {review.length > 0 && (
            <Text className="text-sm text-foreground/90 leading-5" numberOfLines={6}>
              {review}
            </Text>
          )}
        </View>
      )}

      <View className="border-t border-border bg-muted/10 px-4 py-3">
        <Text className="text-xs leading-5 text-foreground">
          <Text className="font-medium">Sharing to: </Text>
          {circleTitles.length > 0 ? circleTitles.join(', ') : '—'}
        </Text>
      </View>
    </View>
  );
}
