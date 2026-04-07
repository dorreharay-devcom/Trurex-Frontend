import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { CREATE_REC_SEARCH_PLACES } from '~/constants/recommendation/mockSearchPlaces';
import { CREATE_REC_CIRCLES } from '~/constants/recommendation/createCircles';
import { CREATE_REC_SCORE_CHIPS } from '~/constants/recommendation/createScorecard';
import { getRexCategoryById } from '~/constants/recommendation/rexCategories';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { CreateStepTitle } from '../CreateStepTitle';
import { Theme } from '~/theme/Theme';
import type { SearchEntryMode } from '~/types/recommendation/create';

type Props = {
  searchMode: SearchEntryMode;
  selectedPlaceId: string | null;
  manualName: string;
  manualAddress: string;
  manualGeotag: { lat: number; lng: number } | null;
  selectedCategoryId: string | null;
  scoreStarRatings: number[];
  scoreAppliesSelected: Record<string, boolean>;
  scoreQuickTip: string;
  scoreReview: string;
  selectedCircleIds: Set<string>;
};

const PREVIEW_USER = {
  name: 'Alex Morgan',
  handle: '@alexmorgan',
  initials: 'AM',
} as const;

function averageStarRating(ratings: number[]): string | null {
  const filled = ratings.filter((n) => n > 0);
  if (filled.length === 0) return null;
  const avg = filled.reduce((a, b) => a + b, 0) / filled.length;
  return (Math.round(avg * 10) / 10).toFixed(1);
}

export const Confirm: React.FC<Props> = ({
  searchMode,
  selectedPlaceId,
  manualName,
  manualAddress,
  manualGeotag,
  selectedCategoryId,
  scoreStarRatings,
  scoreAppliesSelected,
  scoreQuickTip,
  scoreReview,
  selectedCircleIds,
}) => {
  const place = useMemo(() => {
    if (searchMode === 'manual') {
      const geo =
        manualGeotag != null
          ? `Geotagged (${manualGeotag.lat.toFixed(4)}, ${manualGeotag.lng.toFixed(4)})`
          : null;
      return {
        title: manualName.trim() || '—',
        addressLines: [manualAddress.trim() || null, geo].filter(Boolean) as string[],
      };
    }
    const p = selectedPlaceId
      ? CREATE_REC_SEARCH_PLACES.find((x) => x.id === selectedPlaceId)
      : undefined;
    if (!p) return { title: '—', addressLines: [] as string[] };
    return { title: p.title, addressLines: [p.subtitle] };
  }, [searchMode, selectedPlaceId, manualName, manualAddress, manualGeotag]);

  const category = getRexCategoryById(selectedCategoryId ?? '');
  const ratingDisplay = averageStarRating(scoreStarRatings);
  const appliesPicked = CREATE_REC_SCORE_CHIPS.filter((c) => scoreAppliesSelected[c]);
  const circleLabels = CREATE_REC_CIRCLES.filter((c) => selectedCircleIds.has(c.id)).map(
    (c) => c.title,
  );

  const tip = scoreQuickTip.trim();
  const review = scoreReview.trim();

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={CREATE_REC_STEP_INNER}>
        <CreateStepTitle>Looking good! 🦖</CreateStepTitle>
        <Text className="mt-1.5 text-center text-sm font-normal text-foreground leading-5">
          Here's how your recommendation will appear
        </Text>

        <View className="mt-5 rounded-[12px] border border-border bg-card overflow-hidden">
          <View className="flex-row items-start gap-3 p-4 pb-3">
            <View className="h-10 w-10 rounded-full border border-border bg-sand items-center justify-center">
              <Text className="text-sm font-semibold text-sand-dark">{PREVIEW_USER.initials}</Text>
            </View>
            <View className="min-w-0 flex-1">
              <Text className="text-sm font-semibold text-foreground">{PREVIEW_USER.name}</Text>
              <Text className="text-xs text-muted mt-0.5">{PREVIEW_USER.handle} · just now</Text>
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

          {appliesPicked.length > 0 && (
            <View className="flex-row flex-wrap gap-1.5 px-4 pb-3">
              {appliesPicked.map((label) => (
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
              {circleLabels.length > 0 ? circleLabels.join(', ') : '—'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
