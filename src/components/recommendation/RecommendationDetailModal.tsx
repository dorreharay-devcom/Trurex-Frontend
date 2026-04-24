import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
  findNodeHandle,
  Platform,
} from 'react-native';
import { ArrowLeft, Star, MapPin, Quote, Plus, ChevronRight } from 'lucide-react-native';
import { RexCommentsSection } from '~/components/recommendation/comment';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { OverlayModal } from '~/components/common/OverlayModal';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { useOverlaySheetPresentation } from '~/hooks/useOverlaySheetPresentation';
import { Theme } from '~/theme/Theme';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { buildDetailRatingRows } from '~/utils/recommendation/recommendationDetailRatings';
import { cn } from '~/utils/general';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/utils/recommendation/rexMediaPaths';

type Props = {
  visible: boolean;
  recommendation: Recommendation | null;
  onClose: () => void;
  onAddYourOwn?: () => void;
  onCommentCountChange?: (total: number) => void;
  scrollToComments?: boolean;
  onAuthorPress?: (authorId: string) => void;
  onUserPress?: (userId: string) => void;
};

export const RecommendationDetailModal: React.FC<Props> = ({
  visible,
  recommendation,
  onClose,
  onAddYourOwn,
  onCommentCountChange,
  scrollToComments,
  onAuthorPress,
  onUserPress,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const { layout } = modalConfig;
  const scrollRef = useRef<ScrollView>(null);
  const commentsSectionWrapRef = useRef<View>(null);
  const composerAnchorRef = useRef<View>(null);

  const { sheetTranslateY, handleClose } = useOverlaySheetPresentation({
    visible: visible && recommendation != null,
    windowHeight,
    onClose,
  });

  useEffect(() => {
    if (!visible || !recommendation || !scrollToComments) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const scrollToTarget = () => {
      try {
        const targetEl = composerAnchorRef.current ?? commentsSectionWrapRef.current;
        if (!targetEl) return;

        if (Platform.OS === 'web') {
          const el = targetEl as unknown as {
            scrollIntoView?: (o: { behavior?: string; block?: string; inline?: string }) => void;
          };
          el?.scrollIntoView?.({ behavior: 'smooth', block: 'center', inline: 'nearest' });
          return;
        }

        const scrollNode = findNodeHandle(scrollRef.current);
        if (!scrollNode) return;
        targetEl.measureLayout(
          scrollNode,
          (_x, y) => {
            const pad = 32;
            scrollRef.current?.scrollTo({ y: Math.max(0, y - pad), animated: true });
          },
          () => {},
        );
      } catch {}
    };

    timeoutId = setTimeout(
      () => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (cancelled) return;
            scrollToTarget();
          });
        });
      },
      Platform.OS === 'web' ? 420 : 380,
    );

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [visible, scrollToComments, recommendation?.id]);

  const mockRatings = useMemo(
    () => (recommendation ? buildDetailRatingRows(recommendation.rating ?? undefined) : []),
    [recommendation],
  );

  if (!recommendation) {
    return null;
  }

  const user = recommendation.user ?? { name: 'Member', handle: '', avatar: '' };
  const coverPath = rexCoverStoragePathFromRecommendation(recommendation);
  const coverHttp = rexCoverRemoteHttpUrl(recommendation);
  const showHero = !!(coverPath || coverHttp);

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
                <Text className="text-sm font-medium text-foreground">Back</Text>
              </Pressable>
            </View>
            <Text className="min-w-0 flex-1 text-center text-lg font-display font-semibold text-foreground">
              Recommendation
            </Text>
            <View className="w-[60px]" />
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="items-center pb-8"
        >
          <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
            {showHero ? (
              <View className="overflow-hidden rounded-xl">
                <SignedStorageImage
                  bucket={REX_IMAGES_BUCKET}
                  storagePath={coverPath}
                  remoteUri={coverHttp}
                  className="aspect-[16/9] w-full"
                  accessibilityLabel={recommendation.title}
                />
              </View>
            ) : null}

            <View>
              <View className="mb-1 flex-row items-center gap-2">
                <View className="rounded-full border border-border/80 bg-border/40 px-2.5 py-1">
                  <Text className="text-xs font-medium capitalize text-foreground">
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

            <Pressable
              onPress={() => {
                if (!recommendation.authorId || !onAuthorPress) return;
                onClose();
                onAuthorPress(recommendation.authorId);
              }}
              accessibilityRole="button"
              accessibilityLabel={`View ${user.name}'s profile`}
              className="flex-row items-center gap-3 rounded-xl border border-border bg-muted/50 p-4 active:opacity-70"
            >
              <SignedUserAvatar name={user.name} avatar={user.avatar} className="h-10 w-10" />
              <View className="flex-1">
                <Text className="text-sm text-muted-foreground">Recommended by</Text>
                <Text className="font-semibold text-foreground">{user.name}</Text>
              </View>
              {recommendation.authorId && (
                <ChevronRight size={16} color={Theme.colors.secondaryText} />
              )}
            </Pressable>

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

            {(recommendation.tags ?? []).length > 0 ? (
              <View className="gap-3">
                <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Features
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {(recommendation.tags ?? []).map((tag) => (
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

            {onAddYourOwn ? (
              <Pressable
                onPress={() => onAddYourOwn()}
                accessibilityRole="button"
                accessibilityLabel="Add your own rec for this place"
                className="h-12 w-full flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 active:bg-primary/90"
              >
                <Plus size={20} color={Theme.colors.primaryForeground} />
                <Text className="text-base font-semibold text-primary-foreground">
                  Add your own rec for this place
                </Text>
              </Pressable>
            ) : null}

            <View ref={commentsSectionWrapRef} collapsable={false}>
              <RexCommentsSection
                rexId={recommendation.id}
                rexOwnerId={recommendation.authorId}
                onCommentTotalChange={onCommentCountChange}
                composerAnchorRef={composerAnchorRef}
                autoFocusComposer={scrollToComments === true}
                onUserPress={onUserPress}
              />
            </View>

            <View className="h-8" />
          </View>
        </ScrollView>
      </View>
    </OverlayModal>
  );
};
