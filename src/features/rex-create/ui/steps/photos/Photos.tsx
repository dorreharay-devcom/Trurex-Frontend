import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PhotoUploadGrid } from '~/features/rex-create/ui/PhotoUploadGrid';
import CreateStepTitle from '../../CreateStepTitle';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';

type Props = {
  photoPaths: string[];
  onPhotoPathsChange: (paths: string[]) => void;
};

function Photos({ photoPaths, onPhotoPathsChange }: Props) {
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={`${CREATE_REC_STEP_INNER} gap-6`}>
        <View className="items-center gap-2">
          <CreateStepTitle>Add photos</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Show others what makes this place special.
          </Text>
        </View>

        <PhotoUploadGrid photos={photoPaths} onChange={onPhotoPathsChange} maxPhotos={5} />
      </View>
    </ScrollView>
  );
}

export default Photos;
