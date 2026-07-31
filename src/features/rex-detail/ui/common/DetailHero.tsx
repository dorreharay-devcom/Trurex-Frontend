import React from 'react';
import { View } from 'react-native';
import { SignedStorageImage } from '~/shared/ui/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/RexPhotoPlaceholder';
import { Skeleton } from '~/shared/ui/Skeleton';
import { REX_IMAGES_BUCKET } from '~/shared/config/storageBuckets';
import type { RexDetailView } from '~/features/rex-detail/hooks/useRexDetail';
import type { Recommendation } from '~/shared/types/recommendation';
import RexImageCarousel from '../carousel/RexImageCarousel';

type Props = {
  recommendation: Recommendation;
  detail: RexDetailView;
};

function DetailHero({ recommendation, detail }: Props) {
  const { showHeroLoading, galleryPaths, hasCoverImage, coverPath, coverHttp } = detail;

  if (showHeroLoading) {
    return (
      <View
        className="aspect-[16/9] w-full overflow-hidden rounded-xl"
        accessibilityLabel="Loading photos"
      >
        <Skeleton className="h-full w-full rounded-xl bg-muted/40" />
      </View>
    );
  }

  if (galleryPaths.length > 0) {
    return <RexImageCarousel paths={galleryPaths} accessibilityLabelBase={recommendation.title} />;
  }

  if (hasCoverImage) {
    return (
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
    );
  }

  return (
    <RexPhotoPlaceholder
      categoryIcon={recommendation.categoryIcon}
      colors={recommendation.placeholderColors}
      className="aspect-[16/9] w-full rounded-xl"
      emojiSize={54}
      accessibilityLabel={recommendation.title}
    />
  );
}

export default DetailHero;
