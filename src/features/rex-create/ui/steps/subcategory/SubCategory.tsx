import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import type { RexSubcategoryOption } from '~/features/rex-create/lib/categories';
import CreateStepTitle from '../../CreateStepTitle';
import { CREATE_REC_STEP_INNER } from '~/features/rex-create/config/layout';
import { cn } from '~/utils/general';
import SubCategoryRow from './common/SubCategoryRow';

type Props = {
  subCategories: RexSubcategoryOption[];
  selected: string | null;
  onSelect: (code: string) => void;
};

function SubCategory({ subCategories, selected, onSelect }: Props) {
  return (
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerClassName="items-center pb-36"
    >
      <View className={cn(CREATE_REC_STEP_INNER, 'gap-6')}>
        <View className="items-center gap-2">
          <CreateStepTitle>What type of recommendation?</CreateStepTitle>
          <Text className="text-center text-sm text-muted-foreground">
            Select the sub-category that best describes your experience
          </Text>
        </View>

        <View className="gap-2.5">
          {subCategories.map((option) => (
            <SubCategoryRow
              key={option.code}
              option={option}
              selected={selected === option.code}
              onSelect={onSelect}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export default SubCategory;
