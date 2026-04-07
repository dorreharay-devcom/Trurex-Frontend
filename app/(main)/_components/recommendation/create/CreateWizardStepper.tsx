import React from 'react';
import { View, Text } from 'react-native';
import { CREATE_REC_STEPS } from '~/types/recommendation/create';
import { cn } from '~/utils/general';

const LABELS: Record<(typeof CREATE_REC_STEPS)[number], string> = {
  search: 'Search',
  category: 'Category',
  scorecard: 'Scorecard',
  circles: 'Circles',
  confirm: 'Confirm',
};

type Props = {
  currentIndex: number;
};

export const CreateWizardStepper: React.FC<Props> = ({ currentIndex }) => {
  return (
    <View className="mt-3 flex-row gap-1.5 bg-transparent">
      {CREATE_REC_STEPS.map((id, index) => {
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
