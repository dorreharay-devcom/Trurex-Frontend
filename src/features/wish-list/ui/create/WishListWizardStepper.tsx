import React from 'react';
import { Text, View } from 'react-native';
import {
  WISH_LIST_STEP_ORDER,
  type WishListStepId,
} from '~/features/wish-list/hooks/create/useWishListItemWizard';
import { cn } from '~/shared/lib/ui/styles';

const LABELS: Record<WishListStepId, string> = {
  details: 'Details',
  photo: 'Photo',
  confirm: 'Confirm',
};

type Props = {
  currentIndex: number;
};

function WishListWizardStepper({ currentIndex }: Props) {
  return (
    <View className="mt-3 flex-row gap-1.5 bg-transparent">
      {WISH_LIST_STEP_ORDER.map((id, index) => {
        const reached = index <= currentIndex;
        return (
          <View key={id} className="min-w-0 flex-1 flex-col items-center gap-1">
            <View className={cn('h-1 w-full rounded-full', reached ? 'bg-primary' : 'bg-border')} />
            <Text
              numberOfLines={1}
              className={cn(
                'text-center text-[9px] font-medium',
                reached ? 'text-foreground' : 'text-muted-foreground opacity-50',
              )}
            >
              {LABELS[id]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default WishListWizardStepper;
