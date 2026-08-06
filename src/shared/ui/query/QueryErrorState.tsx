import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { liveRegionA11y } from '~/shared/lib/a11y';

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void | Promise<void>;
  compact?: boolean;
};

function QueryErrorState({
  title = "Couldn't load",
  message = 'Check your connection and try again.',
  onRetry,
  compact = false,
}: Props) {
  return (
    <View
      className={compact ? 'items-center px-4 py-4 gap-2' : 'items-center px-4 py-12 gap-3'}
      {...liveRegionA11y(title)}
    >
      <Text
        className="text-base font-semibold text-foreground text-center"
        accessibilityRole="header"
      >
        {title}
      </Text>
      {!compact && <Text className="text-sm text-muted-foreground text-center">{message}</Text>}
      {onRetry ? (
        <Pressable
          onPress={() => void onRetry()}
          className="mt-1 rounded-xl bg-primary px-4 py-2.5 active:opacity-90"
          accessibilityRole="button"
          accessibilityLabel={`Retry: ${title}`}
        >
          <Text className="text-sm font-semibold text-primary-foreground">Retry</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default QueryErrorState;
