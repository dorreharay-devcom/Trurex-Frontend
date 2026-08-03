import React from 'react';
import { View, Text } from 'react-native';
import type { CreateRecStepId } from '~/features/rex-create/types/create';
import { cn } from '~/shared/lib/ui/styles';

const LABELS: Record<CreateRecStepId, string> = {
  search: 'Search',
  category: 'Category',
  type: 'Type',
  scorecard: 'Scorecard',
  photos: 'Photos',
  circles: 'Circles',
  confirm: 'Confirm',
};

type Props = {
  steps: CreateRecStepId[];
  currentIndex: number;
};

const CreateWizardStepper: React.FC<Props> = ({ steps, currentIndex }) => {
  return (
    <View className="mt-3 flex-row gap-1.5 bg-transparent">
      {steps.map((id, index) => {
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
};

export default CreateWizardStepper;
