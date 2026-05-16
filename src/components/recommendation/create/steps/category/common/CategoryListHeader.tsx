import React from 'react';
import { View, Text } from 'react-native';
import type { CategoryPickerTile } from '~/constants/recommendation/rexCategories';
import { CreateStepTitle } from '../../../CreateStepTitle';

export type CategoryListHeaderProps = {
  autoSuggestedCategoryId: string | null;
  autoSuggestedCat: CategoryPickerTile | undefined;
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
          <Text className="max-w-full rounded-full border border-accent-foreground/20 bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground">
            {`✨ Auto-suggested: ${autoSuggestedCat.emoji} ${autoSuggestedCat.label}`}
          </Text>
        </View>
      ) : null}
    </>
  );
}
