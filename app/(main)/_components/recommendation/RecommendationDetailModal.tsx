import React, { useMemo } from 'react';
import { View, Text, ScrollView, Pressable, Image, useWindowDimensions } from 'react-native';
import { ArrowLeft, Star, MapPin, Quote, Plus } from 'lucide-react-native';
import { OverlayModal } from '~/components/common/OverlayModal';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { useOverlaySheetPresentation } from '~/hooks/useOverlaySheetPresentation';
import { Theme } from '~/theme/Theme';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { buildDetailRatingRows } from '~/utils/recommendation/recommendationDetailRatings';
import { cn } from '~/utils/general';

type Props = {
  visible: boolean;
  recommendation: Recommendation | null;
  onClose: () => void;
  onAddYourOwn?: () => void;
};

function isPlaceholderImage(uri: string): boolean {
  const u = uri.toLowerCase();
  return !u || u.includes('placeholder');
}

export const RecommendationDetailModal: React.FC<Props> = ({
  visible,
  recommendation,
  onClose,
  onAddYourOwn,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const { layout } = modalConfig;

  const { sheetTranslateY, handleClose } = useOverlaySheetPresentation({
    visible: visible && recommendation != null,
    windowHeight,
    onClose,
  });

  const mockRatings = useMemo(
    () => (recommendation ? buildDetailRatingRows(recommendation.rating) : []),
    [recommendation],
  );

  if (!recommendation) {
    return null;
  }

  const showHero = !isPlaceholderImage(recommendation.image);

  return (
    <OverlayModal
      visible={visible && !!recommendation}
      onRequestClose={handleClose}
      contentTranslateY={sheetTranslateY}
      backdropBackground={layout.backdropBackground}
    >
      <View className="flex-1 min-h-0 flex-col">
        <View className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-4 backdrop-blur sm:px-6">
          <View className="flex-row items-center">
            <View className="w-[60px] items-start justify-center">
              <Pressable
                onPress={handleClose}
                className="flex-row items-center gap-1.5 rounded-lg py-0.5 active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <ArrowLeft size={20} color={Theme.colors.secondaryText} />
                <Text className="text-sm font-medium text-muted-foreground">Back</Text>
              </Pressable>
            </View>
            <Text className="min-w-0 flex-1 text-center text-lg font-display font-semibold text-foreground">
              Recommendation
            </Text>
            <View className="w-[60px]" />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="items-center pb-8"
        >
          <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
            {showHero ? (
              <View className="overflow-hidden rounded-xl">
                <Image
                  source={{ uri: recommendation.image }}
                  className="aspect-[16/9] w-full"
                  resizeMode="cover"
                  accessibilityLabel={recommendation.title}
                />
              </View>
            ) : null}

            <View>
              <View className="mb-1 flex-row items-center gap-2">
                <View className="rounded-full bg-muted px-2.5 py-1">
                  <Text className="text-xs font-medium capitalize text-muted-foreground">
                    {recommendation.category}
                  </Text>
                </View>
              </View>
              <Text className="mt-2 font-display text-2xl font-bold text-foreground">
                {recommendation.title}
              </Text>
              {recommendation.location ? (
                <View className="mt-1 flex-row items-center gap-1.5">
                  <MapPin size={14} color={Theme.colors.secondaryText} />
                  <Text className="text-sm text-muted-foreground">{recommendation.location}</Text>
                </View>
              ) : null}
            </View>

            <View className="flex-row items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
              <Image
                source={{ uri: recommendation.user.avatar }}
                className="h-10 w-10 rounded-full border-2 border-border"
                resizeMode="cover"
                accessibilityLabel={recommendation.user.name}
              />
              <View>
                <Text className="text-sm text-muted-foreground">Recommended by</Text>
                <Text className="font-semibold text-foreground">{recommendation.user.name}</Text>
              </View>
            </View>

            {recommendation.description ? (
              <View className="rounded-xl border-l-4 border-primary bg-primary/5 p-4">
                <View className="flex-row items-start gap-2">
                  <Quote size={20} color={Theme.colors.primary} style={{ marginTop: 2 }} />
                  <Text className="flex-1 text-base italic leading-relaxed text-foreground">
                    &quot;{recommendation.description}&quot;
                  </Text>
                </View>
              </View>
            ) : null}

            <View className="gap-3">
              <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Ratings
              </Text>
              <View className="gap-2">
                {mockRatings.map((r) => (
                  <View key={r.label} className="flex-row items-center justify-between">
                    <Text className="text-sm text-foreground">{r.label}</Text>
                    <View className="flex-row items-center gap-1.5">
                      <View className="flex-row gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => {
                          const filled = n <= Math.round(r.value);
                          return (
                            <Star
                              key={n}
                              size={14}
                              color={filled ? Theme.colors.accentForeground : Theme.colors.border}
                              fill={filled ? Theme.colors.accentForeground : 'transparent'}
                            />
                          );
                        })}
                      </View>
                      <Text className="w-6 text-right text-xs text-muted-foreground">
                        {r.value.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {recommendation.tags.length > 0 ? (
              <View className="gap-3">
                <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Features
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {recommendation.tags.map((tag) => (
                    <View
                      key={tag}
                      className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5"
                    >
                      <Text className="text-sm font-medium text-primary">{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <Pressable
              onPress={() => onAddYourOwn?.()}
              className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary active:opacity-90"
              accessibilityRole="button"
              accessibilityLabel="Add your own rec for this place"
            >
              <Plus size={20} color={Theme.colors.primaryForeground} />
              <Text className="text-base font-semibold text-primary-foreground">
                Add your own rec for this place
              </Text>
            </Pressable>

            <View className="h-8" />
          </View>
        </ScrollView>
      </View>
    </OverlayModal>
  );
};
