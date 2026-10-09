import React from 'react';
import { View } from 'react-native';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/media/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { gridCoverImageTransform } from '~/shared/lib/media/imageTransform';

type Props = {
  photoPaths: string[];
  categoryIcon?: string | null;
};

function BusinessPhotoGrid({ photoPaths, categoryIcon }: Props) {
  if (photoPaths.length === 0) {
    return (
      <RexPhotoPlaceholder
        categoryIcon={categoryIcon}
        className="aspect-[4/3] w-full rounded-xl"
        emojiSize={48}
      />
    );
  }

  if (photoPaths.length === 1) {
    return (
      <View className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
        <SignedStorageImage
          bucket={REX_IMAGES_BUCKET}
          storagePath={photoPaths[0]}
          className="h-full w-full"
          contentFit="cover"
        />
      </View>
    );
  }

  const transform = gridCoverImageTransform(200);

  return (
    <View className="flex-row flex-wrap gap-1 overflow-hidden rounded-xl">
      {photoPaths.map((path) => (
        <View key={path} className="aspect-square" style={{ width: '49.5%' }}>
          <SignedStorageImage
            bucket={REX_IMAGES_BUCKET}
            storagePath={path}
            className="h-full w-full"
            contentFit="cover"
            imageTransform={transform}
          />
        </View>
      ))}
    </View>
  );
}

export default BusinessPhotoGrid;
