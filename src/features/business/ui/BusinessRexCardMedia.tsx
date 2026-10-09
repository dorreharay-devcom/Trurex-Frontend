import React from 'react';
import { View } from 'react-native';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { RexPhotoPlaceholder } from '~/shared/ui/media/RexPhotoPlaceholder';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { listThumbImageTransform } from '~/shared/lib/media/imageTransform';

type Props = {
  photoPath: string | null;
  categoryIcon?: string | null;
};

function BusinessRexCardMedia({ photoPath, categoryIcon }: Props) {
  return (
    <View className="aspect-[4/3] w-full">
      {photoPath ? (
        <SignedStorageImage
          bucket={REX_IMAGES_BUCKET}
          storagePath={photoPath}
          className="h-full w-full"
          contentFit="cover"
          imageTransform={listThumbImageTransform(260)}
          recyclingKey={photoPath}
        />
      ) : (
        <RexPhotoPlaceholder categoryIcon={categoryIcon} className="h-full w-full" />
      )}
    </View>
  );
}

export default BusinessRexCardMedia;
