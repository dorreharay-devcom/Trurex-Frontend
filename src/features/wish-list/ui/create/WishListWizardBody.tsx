import React from 'react';
import { Animated as RNAnimated, View } from 'react-native';
import type { WishListWizardFlow } from '~/features/wish-list/hooks/create/useWishListItemWizard';
import ConfirmStep from '~/features/wish-list/ui/create/steps/ConfirmStep';
import DetailsStep from '~/features/wish-list/ui/create/steps/DetailsStep';
import PhotoStep from '~/features/wish-list/ui/create/steps/PhotoStep';

type Props = {
  flow: WishListWizardFlow;
  stepOpacity: RNAnimated.Value;
};

function WishListWizardBody({ flow, stepOpacity }: Props) {
  return (
    <View className="min-h-0 w-full flex-1">
      <RNAnimated.View key={flow.stepId} style={{ flex: 1, width: '100%', opacity: stepOpacity }}>
        {flow.stepId === 'details' && <DetailsStep flow={flow} />}
        {flow.stepId === 'photo' && <PhotoStep flow={flow} />}
        {flow.stepId === 'confirm' && <ConfirmStep flow={flow} />}
      </RNAnimated.View>
    </View>
  );
}

export default WishListWizardBody;
