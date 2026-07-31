import React from 'react';
import { View, Text, Pressable, Linking, Platform, ScrollView } from 'react-native';
import { X, ExternalLink, Bookmark, Navigation, Share2 } from 'lucide-react-native';
import type { Recommendation } from '~/shared/types/recommendation';
import type { MapPinType } from '~/types/map/mapPin';
import { Theme } from '~/shared/theme/Theme';
import { SignedUserAvatar } from '~/shared/ui/SignedUserAvatar';
import { useShareRex } from '~/shared/hooks/useShareRex';
import { mapAuthorRecommendedLabel } from '~/utils/map/mapRecommendationData';

type Props = {
  recommendation: Recommendation;
  pinType: MapPinType;
  distanceLabel?: string;
  onClose: () => void;
  onViewFullRex: () => void;
  onSave?: () => void;
};

const pinTypeCopy: Record<MapPinType, string> = {
  network: 'Recommended by your network',
  rex: 'Recommended on TruRex',
  saved: 'In your Saved items',
  beenHere: 'You recommended this',
  overlap: 'Multiple connections',
};

export const MapPinDetailSheet: React.FC<Props> = ({
  recommendation: pin,
  pinType,
  distanceLabel,
  onClose,
  onViewFullRex,
  onSave,
}) => {
  const { shareRecommendation } = useShareRex();
  const label = pinTypeCopy[pinType];
  const authorRecommendedLabel =
    (pinType === 'network' || pinType === 'rex') && pin.user
      ? mapAuthorRecommendedLabel(pin.user)
      : null;
  const showAuthorLine = authorRecommendedLabel != null;

  const openDirections = () => {
    const q = pin.location ?? pin.title;
    const url =
      Platform.OS === 'web'
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
        : (Platform.select({
            ios: `maps:0,0?q=${encodeURIComponent(q)}`,
            android: `geo:0,0?q=${encodeURIComponent(q)}`,
          }) ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`);
    void Linking.openURL(url);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 z-[1200] max-h-[50vh] rounded-t-2xl border-t border-border bg-card shadow-lg">
      <View className="items-center pt-2 pb-1">
        <View className="h-1 w-10 rounded-full bg-muted opacity-50" />
      </View>

      <ScrollView
        className="px-4 pb-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-3 flex-row items-start justify-between">
          <View className="min-w-0 flex-1 pr-2">
            <View className="mb-1 flex-row items-center gap-2">
              {pin.categoryIcon?.trim() ? (
                <View className="h-6 w-6 items-center justify-center overflow-visible">
                  <Text style={{ fontSize: 16, lineHeight: 22 }}>{pin.categoryIcon.trim()}</Text>
                </View>
              ) : null}
              <Text className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {pin.category}
              </Text>
            </View>
            <Text className="font-display text-base font-bold text-foreground" numberOfLines={2}>
              {pin.title}
            </Text>
            {pin.location ? (
              <Text className="mt-0.5 text-xs text-muted-foreground">
                📍 {pin.location}
                {distanceLabel ? ` · ${distanceLabel}` : ''}
              </Text>
            ) : null}
          </View>
          <Pressable
            onPress={onClose}
            className="rounded-lg p-1.5 active:bg-muted/30"
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <X size={16} color={Theme.colors.secondaryText} />
          </Pressable>
        </View>

        <View className="mb-3 flex-row items-center gap-2">
          {showAuthorLine && pin.user ? (
            <>
              <SignedUserAvatar name={pin.user.name} avatar={pin.user.avatar} className="h-6 w-6" />
              <Text className="flex-1 text-xs text-muted-foreground">{authorRecommendedLabel}</Text>
            </>
          ) : (
            <Text className="text-xs text-muted-foreground">{label}</Text>
          )}
        </View>

        <View className="mb-3 flex-row flex-wrap items-center gap-3">
          {pin.rating != null && pin.rating > 0 ? (
            <Text className="text-xs font-semibold text-rating-star">★ {pin.rating}/5</Text>
          ) : null}
          {pin.scoreValueForMoney != null ? (
            <Text className="text-xs text-muted-foreground">💰 {pin.scoreValueForMoney}/5</Text>
          ) : null}
        </View>

        {pin.description ? (
          <Text className="mb-3 rounded-lg bg-muted/20 p-2 text-xs italic text-muted-foreground">
            &ldquo;{pin.description}&rdquo;
          </Text>
        ) : null}

        <View className="flex-row flex-wrap gap-2">
          <Pressable
            onPress={onViewFullRex}
            className="min-w-0 flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5"
          >
            <ExternalLink size={14} color={Theme.colors.primaryForeground} />
            <Text className="text-xs font-medium text-primary-foreground">View Full Rex</Text>
          </Pressable>
          {onSave ? (
            <Pressable
              onPress={onSave}
              className="rounded-xl border border-border p-2.5 active:bg-muted/30"
              accessibilityRole="button"
            >
              <Bookmark
                size={16}
                color={pin.isSaved ? Theme.colors.primary : Theme.colors.foreground}
                fill={pin.isSaved ? Theme.colors.primary : 'transparent'}
              />
            </Pressable>
          ) : null}
          <Pressable
            onPress={openDirections}
            className="rounded-xl border border-border p-2.5 active:bg-muted/30"
          >
            <Navigation size={16} color={Theme.colors.foreground} />
          </Pressable>
          <Pressable
            onPress={() => void shareRecommendation(pin)}
            className="rounded-xl border border-border p-2.5 active:bg-muted/30"
            accessibilityRole="button"
            accessibilityLabel="Share this recommendation"
          >
            <Share2 size={16} color={Theme.colors.foreground} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
