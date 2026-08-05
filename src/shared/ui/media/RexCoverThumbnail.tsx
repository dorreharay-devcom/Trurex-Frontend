import React from 'react';
import { View } from 'react-native';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/media/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import type { Recommendation } from '~/shared/types/recommendation';
import { cn } from '~/shared/lib/ui/styles';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/shared/lib/media/rexImages';
import { listThumbImageTransform } from '~/shared/lib/media/imageTransform';

const LIST_THUMB_TRANSFORM = listThumbImageTransform(48);

type Props = {
  rec: Pick<
    Recommendation,
    'id' | 'title' | 'photoPath' | 'image' | 'categoryIcon' | 'placeholderColors'
  >;
  className?: string;
  imageClassName?: string;
};

export function RexCoverThumbnail({
  rec,
  className = 'h-12 w-12 rounded-lg',
  imageClassName,
}: Props) {
  const coverPath = rexCoverStoragePathFromRecommendation(rec);
  const coverHttp = rexCoverRemoteHttpUrl(rec);

  if (!coverPath && !coverHttp) {
    return (
      <RexPhotoPlaceholder
        categoryIcon={rec.categoryIcon}
        colors={rec.placeholderColors}
        className={cn('shrink-0', className)}
        emojiSize={18}
        accessibilityLabel={rec.title}
      />
    );
  }

  return (
    <View className={cn('shrink-0 overflow-hidden bg-muted', className)}>
      <SignedStorageImage
        bucket={REX_IMAGES_BUCKET}
        storagePath={coverPath}
        remoteUri={coverHttp}
        className={cn('absolute inset-0 h-full w-full', imageClassName)}
        accessibilityLabel={rec.title}
        imageTransform={LIST_THUMB_TRANSFORM}
        recyclingKey={rec.id}
        priority="low"
      />
    </View>
  );
}
