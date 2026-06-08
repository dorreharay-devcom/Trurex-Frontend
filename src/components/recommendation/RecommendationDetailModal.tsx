import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
  findNodeHandle,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Star,
  MapPin,
  Quote,
  Plus,
  ChevronRight,
  Flag,
  Trash2,
  Pencil,
  Link2,
} from 'lucide-react-native';
import { RexCommentsSection } from '~/components/recommendation/comment';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/components/common/RexPhotoPlaceholder';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { OverlayModal } from '~/components/common/OverlayModal';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { CREATE_REC_STEP_INNER } from '~/constants/recommendation/createLayout';
import { modalConfig } from '~/constants/recommendation/modalConfig';
import { deleteRex, fetchRexDetail } from '~/api/rexDetailApi';
import { DestructiveActionConfirmModal } from '~/components/common/DestructiveActionConfirmModal';
import { ReportContentDialog } from '~/components/recommendation/report/ReportContentDialog';
import { useAuth } from '~/services/AuthContext';
import type { ContentReportTarget } from '~/constants/recommendation/contentReport';
import { toastError, toastInfo, toastSuccess } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
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
import { deleteRexToastMessage } from '~/utils/recommendation/rexDetailToRecommendation';
import { Skeleton } from '~/components/ui/skeleton';

const styles = StyleSheet.create({
  headerAction: {
    minWidth: 88,
    height: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerActionPressed: {
    opacity: 0.75,
  },
});

function normalizeWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

type Props = {
  visible: boolean;
  recommendation: Recommendation | null;
  onClose: () => void;
  onAddYourOwn?: (source: AddYourOwnRecSource) => void;
  onCommentCountChange?: (total: number) => void;
  scrollToComments?: boolean;
  onAuthorPress?: (authorId: string) => void;
  onUserPress?: (userId: string) => void;
  onEditRex?: (rexId: string) => void;
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
  onEditRex,
}) => {
  const { height: windowHeight } = useWindowDimensions();
  const { layout } = modalConfig;
  const { user: authUser } = useAuth();
  const [reportTarget, setReportTarget] = useState<ContentReportTarget | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const commentsSectionWrapRef = useRef<View>(null);
  const composerAnchorRef = useRef<View>(null);
  const recommendationId = recommendation?.id;

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
    if (!visible) setDeleteConfirmOpen(false);
  }, [visible]);

  const scrollComposerIntoView = useCallback(() => {
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
          const pad = Platform.OS === 'ios' ? 160 : 96;
          scrollRef.current?.scrollTo({ y: Math.max(0, y - pad), animated: true });
        },
        () => {},
      );
    } catch {}
  }, []);

  const handleComposerFocus = useCallback(() => {
    if (Platform.OS === 'web') {
      scrollComposerIntoView();
      return;
    }
    setTimeout(scrollComposerIntoView, 80);
    setTimeout(scrollComposerIntoView, 340);
  }, [scrollComposerIntoView]);

  useEffect(() => {
    if (!visible || !recommendationId || !scrollToComments) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    timeoutId = setTimeout(
      () => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (cancelled) return;
            scrollComposerIntoView();
          });
        });
      },
      Platform.OS === 'web' ? 420 : 380,
    );

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [visible, scrollToComments, recommendationId, scrollComposerIntoView]);

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

  const placeLocationLine = useMemo(() => {
    if (!recommendation) return '';
    const fromDetail = (rexDetail?.place_location ?? '').trim();
    const fromRec = (recommendation.location ?? '').trim();
    return fromDetail || fromRec;
  }, [recommendation, rexDetail?.place_location]);

  const placeWebsiteText = (rexDetail?.place_website_url ?? '').trim();
  const placeWebsiteHref = useMemo(
    () => normalizeWebsiteUrl(placeWebsiteText),
    [placeWebsiteText],
  );
  const openPlaceWebsite = useCallback(() => {
    if (!placeWebsiteHref) return;
    void Linking.openURL(placeWebsiteHref).catch(() => {
      toastError('Could not open link', 'Check the site URL and try again.');
    });
  }, [placeWebsiteHref]);

  const coverPath = useMemo(
    () => (recommendation ? rexCoverStoragePathFromRecommendation(recommendation) : null),
    [recommendation],
  );
  const coverHttp = useMemo(
    () => (recommendation ? rexCoverRemoteHttpUrl(recommendation) : null),
    [recommendation],
  );
  const hasCoverImage = Boolean(coverPath || coverHttp);
  const showHero = recommendation != null;
  const showDetailHeroLoading =
    Boolean(visible && recommendation) &&
    detailLoading &&
    galleryPaths.length === 0 &&
    !hasCoverImage &&
    !recommendation?.placeholderColors?.length &&
    !recommendation?.categoryIcon?.trim();

  const queryClient = useQueryClient();
  const deleteRexMutation = useMutation({
    mutationFn: deleteRex,
    onSuccess: (_data, rexId) => {
      setDeleteConfirmOpen(false);
      toastSuccess('Deleted', 'Your recommendation was removed.');
      void queryClient.invalidateQueries({ queryKey: ['discover-recommendations'] });
      void queryClient.invalidateQueries({ queryKey: ['search-rexes'] });
      void queryClient.invalidateQueries({ queryKey: ['my-rexes'] });
      void queryClient.removeQueries({ queryKey: ['rexDetail', rexId] });
      void queryClient.invalidateQueries({ queryKey: ['collection-detail'] });
      void queryClient.invalidateQueries({ queryKey: ['my-collections'] });
      void queryClient.invalidateQueries({ queryKey: ['mapRexesInBounds'] });
      void queryClient.invalidateQueries({ queryKey: ['mapRexPins'] });
      handleClose();
    },
    onError: (err: unknown) => {
      if (didAccountFrozenMutationToast(err)) return;
      toastError('Could not delete', deleteRexToastMessage(err));
    },
  });

  const openDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(true);
  }, []);

  const handleConfirmDeleteRex = useCallback(() => {
    const id = recommendation?.id;
    if (!id) return;
    deleteRexMutation.mutate(id);
  }, [recommendation?.id, deleteRexMutation]);

  if (!recommendation) {
    return null;
  }

  const user = recommendation.user ?? { name: 'Member', handle: '', avatar: '' };
  const effectiveAuthorId = recommendation.authorId ?? rexDetail?.author_id;
  const isOwner =
    authUser != null && effectiveAuthorId != null && authUser.id === effectiveAuthorId;

  return (
    <>
      <OverlayModal
        visible={visible && !!recommendation}
        onRequestClose={handleClose}
        contentTranslateY={sheetTranslateY}
        backdropBackground={layout.backdropBackground}
      >
        <View className="flex-1 min-h-0 flex-col">
          <View
            className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-4 backdrop-blur sm:px-6"
            style={
              Platform.OS !== 'web'
                ? { position: 'relative', zIndex: 50, elevation: 50 }
                : undefined
            }
          >
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
              <View className="min-w-0 flex-1" />
              <View className="w-[152px] shrink-0 items-end justify-center">
                {isOwner ? (
                  <View className="flex-row items-center justify-end gap-2">
                    {onEditRex ? (
                      <Pressable
                        onPress={() => onEditRex(recommendation.id)}
                        hitSlop={Platform.OS === 'web' ? 8 : undefined}
                        accessibilityLabel="Edit this recommendation"
                        accessibilityRole="button"
                        className="h-11 items-end justify-center rounded-full active:opacity-90"
                        style={({ pressed }) => [
                          pressed ? styles.headerActionPressed : null,
                        ]}
                      >
                        <View
                          pointerEvents="none"
                          className="h-8 min-w-[76px] flex-row items-center justify-center gap-1 rounded-full border-2 border-primary bg-primary/20 px-2.5"
                        >
                          <Pencil
                            size={12}
                            color={Theme.colors.foreground}
                            strokeWidth={2.25}
                          />
                          <Text
                            className="text-xs font-semibold text-foreground"
                            numberOfLines={1}
                            pointerEvents="none"
                          >
                            Edit
                          </Text>
                        </View>
                      </Pressable>
                    ) : null}
                    <Pressable
                      onPress={openDeleteConfirm}
                      hitSlop={Platform.OS === 'web' ? 8 : undefined}
                      accessibilityLabel="Delete this recommendation"
                      accessibilityRole="button"
                      className="h-11 items-end justify-center rounded-full active:opacity-90"
                      style={({ pressed }) => [pressed ? styles.headerActionPressed : null]}
                    >
                      <View
                        pointerEvents="none"
                        className="h-8 min-w-[76px] flex-row items-center justify-center gap-1 rounded-full border-2 border-destructive bg-destructive/10 px-2.5"
                      >
                        <Trash2 size={12} color={Theme.colors.destructive} strokeWidth={2.25} />
                        <Text
                          className="text-xs font-semibold"
                          style={{ color: Theme.colors.destructive }}
                          numberOfLines={1}
                          pointerEvents="none"
                        >
                          Delete
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                ) : authUser &&
                  (recommendation.authorId == null || authUser.id !== recommendation.authorId) ? (
                  <Pressable
                    onPress={openRexReport}
                    hitSlop={Platform.OS === 'web' ? 8 : undefined}
                    accessibilityLabel="Report this recommendation"
                    accessibilityRole="button"
                    className="h-11 min-w-[88px] items-end justify-center rounded-full active:opacity-90"
                    style={({ pressed }) => [
                      Platform.OS !== 'web' ? styles.headerAction : null,
                      pressed ? styles.headerActionPressed : null,
                    ]}
                  >
                    <View
                      pointerEvents="none"
                      className="h-8 flex-row items-center gap-1 rounded-full border-2 border-destructive bg-destructive/10 px-2.5"
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
                        pointerEvents="none"
                      >
                        Report
                      </Text>
                    </View>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>

          <ScrollView
            ref={scrollRef}
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}
            automaticallyAdjustKeyboardInsets={false}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="items-center pb-8"
            contentContainerStyle={Platform.OS === 'web' ? undefined : { paddingBottom: 180 }}
          >
            <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
              {showDetailHeroLoading ? (
                <View
                  className="aspect-[16/9] w-full overflow-hidden rounded-xl"
                  accessibilityLabel="Loading photos"
                >
                  <Skeleton className="h-full w-full rounded-xl bg-muted/40" />
                </View>
              ) : galleryPaths.length > 0 ? (
                <RexImageCarousel
                  paths={galleryPaths}
                  accessibilityLabelBase={recommendation.title}
                />
              ) : showHero && hasCoverImage ? (
                <View className="aspect-[16/9] w-full overflow-hidden rounded-xl">
                  <SignedStorageImage
                    bucket={REX_IMAGES_BUCKET}
                    storagePath={coverPath}
                    remoteUri={coverHttp}
                    className="h-full w-full"
                    contentFit="cover"
                    skeletonUntilLoaded
                    accessibilityLabel={recommendation.title}
                  />
                </View>
              ) : showHero ? (
                <RexPhotoPlaceholder
                  categoryIcon={recommendation.categoryIcon}
                  colors={recommendation.placeholderColors}
                  className="aspect-[16/9] w-full rounded-xl"
                  emojiSize={54}
                  accessibilityLabel={recommendation.title}
                />
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
                {placeLocationLine ? (
                  <View className="mt-1 flex-row items-center gap-1.5">
                    <MapPin size={14} color={Theme.colors.secondaryText} />
                    <Text className="text-sm text-muted-foreground">{placeLocationLine}</Text>
                  </View>
                ) : null}
                {placeWebsiteHref ? (
                  <Pressable
                    onPress={openPlaceWebsite}
                    accessibilityRole="link"
                    accessibilityLabel={`Open ${placeWebsiteText}`}
                    className="mt-1 flex-row items-center gap-1.5 self-start active:opacity-80"
                  >
                    <Link2 size={14} color={Theme.colors.secondaryText} />
                    <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                      {placeWebsiteText}
                    </Text>
                  </Pressable>
                ) : null}
              </View>

              <Pressable
                onPress={() => {
                  if (!effectiveAuthorId || !onAuthorPress) return;
                  onClose();
                  onAuthorPress(effectiveAuthorId);
                }}
                accessibilityRole="button"
                accessibilityLabel={`View ${user.name}'s profile`}
                className="flex-row items-center gap-3 rounded-xl bg-border/40 p-4 active:opacity-90"
              >
                <SignedUserAvatar name={user.name} avatar={user.avatar} className="h-10 w-10" />
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground">Recommended by</Text>
                  <Text className="font-semibold text-foreground">{user.name}</Text>
                </View>
                {effectiveAuthorId && <ChevronRight size={16} color={Theme.colors.secondaryText} />}
              </Pressable>

              {recommendation.description ? (
                <View className="rounded-xl border-l-4 border-primary bg-accent p-4">
                  <View className="flex-row items-start gap-2">
                    <Quote size={20} color={Theme.brand.colorDark} style={{ marginTop: 2 }} />
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
                                color={filled ? Theme.colors.ratingStar : Theme.colors.border}
                                fill={filled ? Theme.colors.ratingStar : 'transparent'}
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
                        className="rounded-full border border-border/80 bg-border/40 px-3 py-1.5"
                      >
                        <Text className="text-sm font-medium text-foreground">{tag}</Text>
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
                  onCommentTotalChange={onCommentCountChange}
                  composerAnchorRef={composerAnchorRef}
                  autoFocusComposer={scrollToComments === true}
                  onUserPress={onUserPress}
                  onReportComment={openCommentReport}
                  onComposerFocus={handleComposerFocus}
                />
              </View>

              <View className="h-8" />
            </View>
          </ScrollView>
          <ReportContentDialog
            inline
            open={reportTarget != null}
            onOpenChange={(o) => {
              if (!o) setReportTarget(null);
            }}
            target={reportTarget}
          />
          <DestructiveActionConfirmModal
            inline
            visible={deleteConfirmOpen}
            title="Delete recommendation?"
            message="This permanently removes this rex and related likes, comments, photos, saves, and collection entries. This can't be undone."
            confirmLabel="Delete"
            pending={deleteRexMutation.isPending}
            onCancel={() => setDeleteConfirmOpen(false)}
            onConfirm={handleConfirmDeleteRex}
          />
        </View>
      </OverlayModal>
    </>
  );
};
