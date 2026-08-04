import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import { isWeb } from '~/shared/lib/ui/platform';
import { webDisabledCursor, cn } from '~/shared/lib/ui/styles';

type Props = {
  canCreate: boolean;
  creating: boolean;
  onPress: () => void;
};

function CreateCollectionButton({ canCreate, creating, onPress }: Props) {
  const disabledCursorStyle = webDisabledCursor(!canCreate);

  return (
    <View
      className={cn('w-full', !canCreate && isWeb && 'cursor-not-allowed')}
      style={disabledCursorStyle}
    >
      <Pressable
        onPress={() => {
          if (!canCreate) return;
          onPress();
        }}
        disabled={!canCreate && !isWeb}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canCreate }}
        style={disabledCursorStyle}
        className={cn(
          'w-full items-center rounded-xl py-3',
          canCreate
            ? 'cursor-pointer bg-primary active:opacity-90'
            : 'cursor-not-allowed bg-primary/40 opacity-50',
        )}
      >
        {creating ? (
          <ActivityIndicator color={Theme.colors.primaryForeground} />
        ) : (
          <Text pointerEvents="none" className="text-sm font-semibold text-primary-foreground">
            Create Collection
          </Text>
        )}
      </Pressable>
    </View>
  );
}

export default CreateCollectionButton;
