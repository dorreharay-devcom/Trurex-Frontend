import React from 'react';
import { Text, View } from 'react-native';
import {
  REX_REQUEST_STEP_ORDER,
  type RexRequestStepId,
} from '~/features/rex-requests/hooks/create/useCreateRexRequestWizard';
import { cn } from '~/shared/lib/ui/styles';

const LABELS: Record<RexRequestStepId, string> = {
  details: 'Details',
  category: 'Category',
  needBy: 'Need by',
  circles: 'Circles',
  confirm: 'Confirm',
};

type Props = {
  currentIndex: number;
};

function CreateRexRequestStepper({ currentIndex }: Props) {
  return (
    <View className="mt-3 flex-row gap-1.5 bg-transparent">
      {REX_REQUEST_STEP_ORDER.map((id, index) => {
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

export default CreateRexRequestStepper;
