import React from 'react';
import { View, Text, type TextStyle } from 'react-native';
import { Link2, Star, MapPin, DollarSign, type LucideIcon } from 'lucide-react-native';
import { SignedStorageImage } from '~/shared/ui/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { Theme } from '~/shared/theme/Theme';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
  rexPhotoStoragePathsFromRecommendation,
} from '~/shared/lib/media/rexImages';
import { feedCoverImageTransform } from '~/shared/lib/media/imageTransform';
import type { Recommendation } from '~/shared/types/recommendation';
import { placeDisplayTitle, valueForMoneyLabel } from '~/shared/lib/recommendation';
import { isWeb } from '~/shared/lib/ui/platform';

const MAX_GALLERY_DOTS = 5;
const FEED_COVER_TRANSFORM = feedCoverImageTransform();

const addressEllipsisStyle = isWeb
  ? ({ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as TextStyle)
  : undefined;

function CardCoverImage({ rec }: { rec: Recommendation }) {
  const coverPath = rexCoverStoragePathFromRecommendation(rec);
  const coverHttp = rexCoverRemoteHttpUrl(rec);
  if (coverPath || coverHttp) {
    return (
      <SignedStorageImage
        bucket={REX_IMAGES_BUCKET}
        storagePath={coverPath}
        remoteUri={coverHttp}
        className="absolute inset-0"
        contentFit="cover"
        accessibilityLabel={rec.title}
        imageTransform={FEED_COVER_TRANSFORM}
        recyclingKey={rec.id}
        priority="normal"
      />
    );
  }
  return (
    <RexPhotoPlaceholder
      categoryIcon={rec.categoryIcon}
      colors={rec.placeholderColors}
      className="absolute inset-0 h-full w-full"
      emojiSize={46}
      accessibilityLabel={rec.title}
    />
  );
}

function GalleryDots({ rec }: { rec: Recommendation }) {
  const gallery = rexPhotoStoragePathsFromRecommendation(rec);
  const galleryCount = Math.max(rec.photoCount ?? 0, gallery.length) || 0;
  if (galleryCount <= 1) return null;
  const dotCount = Math.min(MAX_GALLERY_DOTS, galleryCount);
  return (
    <View className="absolute right-2 top-2 flex-row items-center gap-1 rounded-full bg-black/45 px-2 py-1.5">
      {Array.from({ length: dotCount }, (_, index) => (
        <View
          key={index}
          className="h-1.5 w-1.5 rounded-full bg-white"
          style={{ opacity: index === 0 ? 1 : 0.4 }}
        />
      ))}
    </View>
  );
}

function MetaLine({ icon: Icon, text }: { icon: LucideIcon; text: string | undefined }) {
  if (!text) return null;
  return (
    <View className="w-full flex-row items-center gap-1">
      <Icon size={12} color="rgba(255,255,255,0.8)" />
      <Text
        className="min-w-0 flex-1 text-xs text-white/80"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={addressEllipsisStyle}
      >
        {text}
      </Text>
    </View>
  );
}

function RatingLine({ rec }: { rec: Recommendation }) {
  const showStarRating = rec.rating != null && rec.rating > 0;
  const vfmLabel =
    rec.scoreValueForMoney != null ? valueForMoneyLabel(rec.scoreValueForMoney) : null;
  if (!showStarRating && !vfmLabel) return null;
  return (
    <View className="flex-row items-center gap-x-3 gap-y-1">
      {showStarRating ? (
        <View className="flex-row items-center gap-1">
          <Star size={12} color={Theme.colors.ratingStar} fill={Theme.colors.ratingStar} />
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
  );
}

function CardMedia({ rec }: { rec: Recommendation }) {
  return (
    <View
      className="relative mx-4 overflow-hidden rounded-xl bg-muted"
      style={{ aspectRatio: 4 / 3 }}
    >
      <CardCoverImage rec={rec} />
      <GalleryDots rec={rec} />
      <View className="absolute bottom-0 left-0 right-0 p-3 bg-black/55">
        <Text className="text-lg font-bold text-white">{placeDisplayTitle(rec.title)}</Text>
        <View className="mt-1 flex-col items-start gap-y-1">
          <MetaLine icon={MapPin} text={rec.location || undefined} />
          <MetaLine icon={Link2} text={rec.placeWebsiteUrl?.trim()} />
          <RatingLine rec={rec} />
        </View>
      </View>
    </View>
  );
}

export default CardMedia;
