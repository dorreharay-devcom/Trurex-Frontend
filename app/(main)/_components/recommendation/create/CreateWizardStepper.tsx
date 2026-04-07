import React from 'react';
import { View, Text } from 'react-native';
import { CREATE_REC_STEPS } from '~/types/recommendation/create';

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
    <View className="flex-row bg-transparent px-2 pb-3 pt-1">
      {CREATE_REC_STEPS.map((id, index) => {
        const active = index === currentIndex;
        return (
          <View key={id} className="flex-1 min-w-0 px-0.5">
            <View
              className={`h-1 rounded-full mb-2 ${active ? 'bg-primary' : 'bg-border'}`}
              style={{ opacity: active ? 1 : 0.6 }}
            />
            <Text
              numberOfLines={1}
              className={`text-center text-[10px] sm:text-xs font-medium ${active ? 'text-foreground' : 'text-muted'}`}
            >
              {LABELS[id]}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
