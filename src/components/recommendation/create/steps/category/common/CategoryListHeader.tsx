import React from 'react';
import { View, Text } from 'react-native';
import type { RexCategory } from '~/constants/recommendation/rexCategories';
import { CreateStepTitle } from '../../../CreateStepTitle';

export type CategoryListHeaderProps = {
  autoSuggestedCategoryId: string | null;
  autoSuggestedCat: RexCategory | undefined;
};

export function CategoryListHeader({
  autoSuggestedCategoryId,
  autoSuggestedCat,
}: CategoryListHeaderProps) {
  return (
    <>
      <View className="items-center space-y-2 px-1 pb-2">
        <CreateStepTitle className="px-1">Confirm the category</CreateStepTitle>
        <Text className="px-2 text-center text-sm text-muted-foreground">
          {autoSuggestedCategoryId
            ? "We've suggested one — feel free to change it"
            : 'Choose the category that best fits your recommendation'}
        </Text>
      </View>
      {autoSuggestedCat ? (
        <View className="items-center mb-4">
          <Text className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 text-center max-w-full">
            {`✨ Auto-suggested: ${autoSuggestedCat.emoji} ${autoSuggestedCat.label}`}
          </Text>
        </View>
      ) : null}
    </>
  );
}
