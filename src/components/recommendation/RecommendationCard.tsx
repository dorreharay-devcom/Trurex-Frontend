import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, type TextStyle } from 'react-native';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Star,
  MapPin,
  DollarSign,
  X,
} from 'lucide-react-native';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { RexPlaceholderHtml } from '~/components/common/RexPlaceholderHtml';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { likeRex, unlikeRex } from '~/api/rexLikesApi';
import { Theme } from '~/theme/Theme';
import type {
  Recommendation,
  RecommendationOpenOptions,
} from '~/types/recommendation/recommendation';
import { useAuth } from '~/services/AuthContext';
import { useShareRex } from '~/hooks/recommendation/useShareRex';
import { toastError } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { unknownErrorMessage } from '~/utils';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
  rexPhotoStoragePathsFromRecommendation,
  valueForMoneyLabel,
} from '~/utils/recommendation/recContentDisplay';
import { cn } from '~/utils/general';
import { isWeb } from '~/utils';

export type { Recommendation, RecommendationOpenOptions };

interface RecommendationCardProps {
  recommendation: Recommendation;
  onTap?: (rec: Recommendation, options?: RecommendationOpenOptions) => void;
  onSave?: (rec: Recommendation) => void;
  onRemove?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation: rec,
  onTap,
  onSave,
  onRemove,
}) => {
  const { user } = useAuth();
  const { shareRecommendation } = useShareRex();
  const [liked, setLiked] = useState(rec.isLiked);
  const [likes, setLikes] = useState(rec.likes);
  const [saved, setSaved] = useState(rec.isSaved ?? false);

  const likeBusy = useRef(false);

  useEffect(() => {
    setLiked(rec.isLiked);
    setLikes(rec.likes);
    setSaved(rec.isSaved ?? false);
  }, [rec.id, rec.isLiked, rec.likes, rec.isSaved]);

  const author = rec.user ?? { name: 'Member', handle: '', avatar: '' };
  const tags = rec.tags ?? [];
  const categoryPlaceholderHtml = rec.rexPlaceholderHtml?.trim() || null;
  const useCategoryPlaceholder = Boolean(categoryPlaceholderHtml);
  const coverPath = rexCoverStoragePathFromRecommendation(rec);
  const coverHttp = rexCoverRemoteHttpUrl(rec);
  const gallery = rexPhotoStoragePathsFromRecommendation(rec);
  const galleryCount = useCategoryPlaceholder
    ? 0
    : Math.max(rec.photoCount ?? 0, gallery.length) || 0;
  const showGalleryHint = galleryCount > 1;
  const maxGalleryDots = 5;
  const galleryDotCount = Math.min(maxGalleryDots, galleryCount);
  const vfmLabel =
    rec.scoreValueForMoney != null ? valueForMoneyLabel(rec.scoreValueForMoney) : null;
  const showStarRating = rec.rating != null && rec.rating > 0;
  const addressEllipsisStyle = isWeb
    ? ({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      } as TextStyle)
    : undefined;

  const toggleLike = async () => {
    if (!user) {
      toastError('Sign in required', 'Please sign in to like recommendations.');
      return;
    }
    if (likeBusy.current) return;
    likeBusy.current = true;

    const wasLiked = liked;
    const nextLiked = !wasLiked;
    setLiked(nextLiked);
    setLikes((n) => (nextLiked ? n + 1 : n - 1));

    try {
      if (nextLiked) {
        await likeRex(rec.id);
      } else {
        await unlikeRex(rec.id);
      }
    } catch (e) {
      setLiked(wasLiked);
      setLikes((n) => (nextLiked ? n - 1 : n + 1));
      if (didAccountFrozenMutationToast(e)) return;
      const detail = unknownErrorMessage(e, '').trim();
      if (detail) {
        toastError(detail);
      } else {
        toastError("Couldn't update like", 'Try again.');
      }
    } finally {
      likeBusy.current = false;
    }
  };

  const Wrapper = onTap ? TouchableOpacity : View;

  return (
    <Wrapper
      {...(onTap ? { activeOpacity: 0.95, onPress: () => onTap(rec) } : {})}
      className="bg-card border border-border rounded-xl overflow-hidden mb-4"
    >
      <View className="flex-row items-center gap-3 p-4 pb-2">
        <SignedUserAvatar name={author.name} avatar={author.avatar} />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">{author.name}</Text>
          <Text className="text-xs text-muted">
            {author.handle ? `${author.handle} · ` : ''}
            {rec.timeAgo}
          </Text>
        </View>
        <View className="rounded-full border border-border/80 bg-border/40 px-2.5 py-1">
          <Text className="text-xs font-medium capitalize text-foreground">{rec.category}</Text>
        </View>
        {onRemove && (
          <TouchableOpacity
            onPress={onRemove}
            className="w-7 h-7 rounded-full bg-destructive items-center justify-center"
          >
            <X size={13} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View
        className={cn(
          'relative mx-4 overflow-hidden rounded-xl',
          useCategoryPlaceholder ? 'bg-transparent' : 'bg-muted',
        )}
        style={{ aspectRatio: 4 / 3 }}
      >
        {useCategoryPlaceholder ? (
          <RexPlaceholderHtml html={categoryPlaceholderHtml!} fit="cover" />
        ) : (
          <SignedStorageImage
            bucket={REX_IMAGES_BUCKET}
            storagePath={coverPath}
            remoteUri={coverHttp}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            accessibilityLabel={rec.title}
          />
        )}
        {showGalleryHint ? (
          <View className="absolute right-2 top-2 flex-row items-center gap-1 rounded-full bg-black/45 px-2 py-1.5">
            {Array.from({ length: galleryDotCount }, (_, index) => (
              <View
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-white"
                style={{ opacity: index === 0 ? 1 : 0.4 }}
              />
            ))}
          </View>
        ) : null}
        <View className="absolute bottom-0 left-0 right-0 p-3 bg-black/55">
          <Text className="text-lg font-bold text-white">{rec.title}</Text>
          <View className="mt-1 flex-col items-start gap-y-1">
            {rec.location ? (
              <View className="w-full flex-row items-center gap-1">
                <MapPin size={12} color="rgba(255,255,255,0.8)" />
                <Text
                  className="min-w-0 flex-1 text-xs text-white/80"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={addressEllipsisStyle}
                >
                  {rec.location}
                </Text>
              </View>
            ) : null}
            {(showStarRating || vfmLabel) && (
              <View className="flex-row items-center gap-x-3 gap-y-1">
                {showStarRating ? (
                  <View className="flex-row items-center gap-1">
                    <Star
                      size={12}
                      color={Theme.colors.ratingStar}
                      fill={Theme.colors.ratingStar}
                    />
                    <Text className="text-xs text-rating-star">
                      {rec.rating != null && rec.rating % 1 === 0
                        ? String(rec.rating)
                        : rec.rating!.toFixed(1)}
                    </Text>
                  </View>
                ) : null}
                {vfmLabel ? (
                  <View className="flex-row items-center gap-0.5">
                    <DollarSign size={12} color="rgba(255,255,255,0.9)" />
                    <Text className="text-[11px] text-white/90">{vfmLabel}</Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>
        </View>
      </View>

      <Text className="px-4 pt-3 text-sm text-foreground opacity-[0.85]" numberOfLines={3}>
        {rec.description ?? ''}
      </Text>

      {tags.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5 px-4 pt-2">
          {tags.map((tag) => (
            <View
              key={tag}
              className="rounded-full border border-border/80 bg-border/40 px-2 py-0.5"
            >
              <Text className="text-xs font-medium text-foreground">#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      <View className="flex-row items-center justify-between px-4 py-3 mt-1">
        <View className="flex-row items-center gap-5">
          <TouchableOpacity onPress={toggleLike} className="flex-row items-center gap-1.5">
            <Heart
              size={20}
              color={liked ? Theme.colors.destructive : Theme.colors.muted}
              fill={liked ? Theme.colors.destructive : 'transparent'}
            />
            <Text className="text-xs text-muted">{likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onTap?.(rec, { scrollToComments: true })}
            disabled={!onTap}
            accessibilityRole="button"
            accessibilityLabel="View comments"
            className="flex-row items-center gap-1.5"
          >
            <MessageCircle size={20} color={Theme.colors.muted} />
            <Text className="text-xs text-muted">{rec.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => void shareRecommendation(rec)}
            accessibilityRole="button"
            accessibilityLabel="Share recommendation"
          >
            <Share2 size={20} color={Theme.colors.muted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => onSave?.(rec)}>
          <Bookmark
            size={20}
            color={saved ? Theme.colors.primary : Theme.colors.muted}
            fill={saved ? Theme.colors.primary : 'transparent'}
          />
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default RecommendationCard;
