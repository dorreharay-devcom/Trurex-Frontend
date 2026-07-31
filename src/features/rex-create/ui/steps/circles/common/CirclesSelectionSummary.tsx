import React from 'react';
import { View, Text } from 'react-native';
import type { CreateRecCircle } from '~/types/circles';
import { circleFooterSubtitle } from '~/features/rex-create/lib/circles';

type Props = {
  privateSelected: boolean;
  selectedCount: number;
  displayCircle: CreateRecCircle | undefined;
};

function CirclesSelectionSummary({ privateSelected, selectedCount, displayCircle }: Props) {
  return (
    <>
      <Text className="text-center text-sm font-medium text-foreground">
        {privateSelected
          ? 'Private Rex selected'
          : `${selectedCount} circle${selectedCount === 1 ? '' : 's'} selected`}
      </Text>

      {privateSelected ? (
        <View className="items-center gap-0.5">
          <Text className="text-base font-semibold text-foreground">Private</Text>
          <Text className="text-xs text-muted-foreground">Only you can see this Rex</Text>
        </View>
      ) : displayCircle != null ? (
        <View className="items-center gap-0.5">
          <Text className="text-base font-semibold" style={{ color: displayCircle.accent }}>
            {displayCircle.title}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {circleFooterSubtitle(displayCircle)}
          </Text>
        </View>
      ) : null}
    </>
  );
}

export default CirclesSelectionSummary;
