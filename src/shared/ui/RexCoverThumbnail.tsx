import React from 'react';
import { View } from 'react-native';
import { SignedStorageImage } from '~/shared/ui/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/storageBuckets';
import type { Recommendation } from '~/shared/types/recommendation';
import { cn } from '~/utils/general';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/shared/lib/rexImages';

type Props = {
  rec: Pick<Recommendation, 'title' | 'photoPath' | 'image' | 'categoryIcon' | 'placeholderColors'>;
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
        className={cn('h-full w-full', imageClassName)}
        accessibilityLabel={rec.title}
      />
    </View>
  );
}
