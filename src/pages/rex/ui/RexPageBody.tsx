import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { RexPageState } from '~/pages/rex/hooks/useRexPage';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  page: RexPageState;
  onGoToDiscover: () => void;
};

type FallbackProps = {
  message: string;
  onGoToDiscover: () => void;
};

function DiscoverFallback({ message, onGoToDiscover }: FallbackProps) {
  return (
    <View className="flex-1 justify-center items-center px-6">
      <Text className="text-center text-foreground mb-4">{message}</Text>
      <Pressable onPress={onGoToDiscover} className="py-2 px-4 bg-primary rounded-lg">
        <Text className="text-white font-semibold">Go to Discover</Text>
      </Pressable>
    </View>
  );
}

function RexPageBody({ page, onGoToDiscover }: Props) {
  const { rexId, recommendation, isPending, isError } = page;

  if (!rexId) {
    return (
      <DiscoverFallback message="Missing recommendation link." onGoToDiscover={onGoToDiscover} />
    );
  }
  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }
  if (isError) {
    return (
      <DiscoverFallback
        message="Couldn't open this recommendation."
        onGoToDiscover={onGoToDiscover}
      />
    );
  }
  if (recommendation == null) {
    return <DiscoverFallback message="Recommendation not found." onGoToDiscover={onGoToDiscover} />;
  }
  return <View className="flex-1" />;
}

export default RexPageBody;
