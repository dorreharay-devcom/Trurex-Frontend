import React from 'react';
import { View, Text } from 'react-native';
import type { CategoryPickerTile } from '~/constants/recommendation/rexCategories';
import CreateStepTitle from '../../../CreateStepTitle';

export type CategoryListHeaderProps = {
  suggestion: CategoryPickerTile | undefined;
};

function CategoryListHeader({ suggestion }: CategoryListHeaderProps) {
  return (
    <>
      <View className="items-center space-y-2 px-1 pb-2">
        <CreateStepTitle className="px-1">Confirm the category</CreateStepTitle>
        <Text className="px-2 text-center text-sm text-muted-foreground">
          {suggestion
            ? "We've suggested one — feel free to change it"
            : 'Choose the category that best fits your recommendation'}
        </Text>
      </View>
      {suggestion ? (
        <View className="items-center mb-4">
          <Text className="max-w-full rounded-full border border-accent-foreground/20 bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground">
            {`✨ Auto-suggested: ${suggestion.emoji} ${suggestion.label}`}
          </Text>
        </View>
      ) : null}
    </>
  );
}

export default CategoryListHeader;
