import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
  findNodeHandle,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, MapPin, Quote, Plus, ChevronRight, Flag } from 'lucide-react-native';
import { RexCommentsSection } from '~/components/recommendation/comment';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { OverlayModal } from '~/components/common/OverlayModal';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { fetchRexDetail } from '~/api/rexDetailApi';
import { ReportContentDialog } from '~/components/recommendation/report/ReportContentDialog';
import { useAuth } from '~/services/AuthContext';
import type { ContentReportTarget } from '~/constants/recommendation/contentReport';
import { toastInfo } from '~/utils/appToast';
import { useOverlaySheetPresentation } from '~/hooks/useOverlaySheetPresentation';
import { Theme } from '~/theme/Theme';
import type { Recommendation } from '~/types/recommendation/recommendation';
import {
  buildAddYourOwnRecSource,
  type AddYourOwnRecSource,
} from '~/utils/recommendation/recCreateFlow';
import { buildDetailRatingRows } from '~/utils/recommendation/recContentDisplay';
import { cn } from '~/utils/general';
import { RexImageCarousel } from './RexImageCarousel';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
  rexPhotoStoragePathsFromRecommendation,
} from '~/utils/recommendation/recContentDisplay';

type Props = {
  visible: boolean;
  recommendation: Recommendation | null;
  onClose: () => void;
  onAddYourOwn?: (source: AddYourOwnRecSource) => void;
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
  const { user: authUser } = useAuth();
  const [reportTarget, setReportTarget] = useState<ContentReportTarget | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const commentsSectionWrapRef = useRef<View>(null);
  const composerAnchorRef = useRef<View>(null);

  const setReport = useCallback((t: ContentReportTarget | null) => setReportTarget(t), []);
  const openRexReport = useCallback(() => {
    if (!recommendation) return;
    if (!authUser) {
      toastInfo('Sign in', 'Sign in to report this recommendation.');
      return;
    }
    if (recommendation.authorId != null && authUser.id === recommendation.authorId) {
      return;
    }
    setReport({ kind: 'recommendation', rexId: recommendation.id });
  }, [recommendation, authUser, setReport]);
  const openCommentReport = useCallback(
    (commentId: string) => {
      if (!recommendation) return;
      if (!authUser) {
        toastInfo('Sign in', 'Sign in to report this comment.');
        return;
      }
      setReport({ kind: 'comment', rexId: recommendation.id, commentId });
    },
    [recommendation, authUser, setReport],
  );

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

  const { data: rexDetail, isLoading: detailLoading } = useQuery({
    queryKey: ['rexDetail', recommendation?.id] as const,
    queryFn: async ({ queryKey }) => {
      const id = queryKey[1];
      if (typeof id !== 'string') {
        throw new Error('Missing rex id');
      }
      return fetchRexDetail(id);
    },
    enabled: visible && typeof recommendation?.id === 'string',
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const mockRatings = useMemo(
    () => (recommendation ? buildDetailRatingRows(recommendation.rating ?? undefined) : []),
    [recommendation],
  );

  const galleryPaths = useMemo(() => {
    if (!recommendation) return [];
    const normalize = (s: string) => {
      const t = s.trim();
      if (!t || t === 'null' || t === 'undefined') {
        return null;
      }
      return t;
    };
    const fromDetail =
      rexDetail?.photo_paths
        ?.map((p) => normalize(String(p)))
        .filter((p): p is string => p != null) ?? [];
    if (fromDetail.length > 0) {
      return fromDetail;
    }
    return rexPhotoStoragePathsFromRecommendation(recommendation);
  }, [rexDetail, recommendation]);

  const coverPath = useMemo(
    () => (recommendation ? rexCoverStoragePathFromRecommendation(recommendation) : null),
    [recommendation],
  );
  const coverHttp = useMemo(
    () => (recommendation ? rexCoverRemoteHttpUrl(recommendation) : null),
    [recommendation],
  );
  const showHero = useMemo(
    () => galleryPaths.length > 0 || !!(coverPath || coverHttp),
    [galleryPaths, coverPath, coverHttp],
  );
  const showDetailHeroLoading =
    Boolean(visible && recommendation) &&
    detailLoading &&
    galleryPaths.length === 0 &&
    !(coverPath || coverHttp);

  if (!recommendation) {
    return null;
  }

  const user = recommendation.user ?? { name: 'Member', handle: '', avatar: '' };

  return (
    <>
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
              <View className="w-[60px] items-end justify-center">
                {authUser &&
                (recommendation.authorId == null || authUser.id !== recommendation.authorId) ? (
                  <Pressable
                    onPress={openRexReport}
                    accessibilityLabel="Report this recommendation"
                    accessibilityRole="button"
                    className="h-8 flex-row items-center gap-1 rounded-full border-2 border-destructive bg-destructive/10 px-2.5 active:opacity-90"
                  >
                    <Flag
                      size={12}
                      color={Theme.colors.destructive}
                      fill={Theme.colors.destructive}
                    />
                    <Text
                      className="text-xs font-semibold"
                      style={{ color: Theme.colors.destructive }}
                      numberOfLines={1}
                    >
                      Report
                    </Text>
                  </Pressable>
                ) : null}
              </View>
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
              {showDetailHeroLoading ? (
                <View
                  className="aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted"
                  accessibilityLabel="Loading photos"
                >
                  <ActivityIndicator color={Theme.colors.primary} />
                </View>
              ) : galleryPaths.length > 0 ? (
                <RexImageCarousel
                  paths={galleryPaths}
                  accessibilityLabelBase={recommendation.title}
                />
              ) : showHero && (coverPath || coverHttp) ? (
                <View className="overflow-hidden rounded-xl bg-gray-100 aspect-[4/3]">
                  <SignedStorageImage
                    bucket={REX_IMAGES_BUCKET}
                    storagePath={coverPath}
                    remoteUri={coverHttp}
                    className="w-full h-full"
                    contentFit="contain"
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
                  onPress={() => onAddYourOwn(buildAddYourOwnRecSource(recommendation, rexDetail))}
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
                  onReportComment={openCommentReport}
                />
              </View>

              <View className="h-8" />
            </View>
          </ScrollView>
        </View>
      </OverlayModal>
      <ReportContentDialog
        open={reportTarget != null}
        onOpenChange={(o) => {
          if (!o) setReportTarget(null);
        }}
        target={reportTarget}
      />
    </>
  );
};
