import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { WishListWizardFlow } from '~/features/wish-list/hooks/create/useWishListItemWizard';
import WishListPreviewCard from '~/features/wish-list/ui/create/steps/common/WishListPreviewCard';
import CreateStepTitle from '~/features/rex-create/ui/CreateStepTitle';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';

type Props = {
  flow: WishListWizardFlow;
};

function ConfirmStep({ flow }: Props) {
  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={`${CREATE_REC_STEP_INNER} gap-6`}>
        <View className="items-center gap-2">
          <CreateStepTitle>
            {flow.isEditMode ? 'Save your changes?' : 'Add this to your Wish List?'}
          </CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Here&apos;s a preview of your Wish List item.
          </Text>
        </View>

        <WishListPreviewCard
          brandName={flow.brandName}
          productName={flow.productName}
          size={flow.size}
          colour={flow.colour}
          note={flow.note}
          photoPath={flow.photoPath}
          tagSlugs={[...flow.tags.selected]}
        />
      </View>
    </ScrollView>
  );
}

export default ConfirmStep;
