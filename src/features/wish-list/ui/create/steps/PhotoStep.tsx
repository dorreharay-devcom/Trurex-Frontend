import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { WishListWizardFlow } from '~/features/wish-list/hooks/create/useWishListItemWizard';
import { PhotoUploadGrid } from '~/features/rex-create/ui/PhotoUploadGrid';
import CreateStepTitle from '~/features/rex-create/ui/CreateStepTitle';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';

type Props = {
  flow: WishListWizardFlow;
};

function PhotoStep({ flow }: Props) {
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={`${CREATE_REC_STEP_INNER} gap-6`}>
        <View className="items-center gap-2">
          <CreateStepTitle>Add a photo</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Optional, but it helps you remember exactly what you want.
          </Text>
        </View>

        <PhotoUploadGrid
          bucket={REX_IMAGES_BUCKET}
          maxPhotos={1}
          photos={flow.photoPath ? [flow.photoPath] : []}
          onChange={(paths) => flow.setPhotoPath(paths[0] ?? null)}
        />
      </View>
    </ScrollView>
  );
}

export default PhotoStep;
