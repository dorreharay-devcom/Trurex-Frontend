import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { Theme } from '~/theme/Theme';

type Props = {
  visible: boolean;
  loading: boolean;
  onPress: () => void;
};

export function ConnectionLoadMoreButton({ visible, loading, onPress }: Props) {
  if (!visible) return null;

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      className="mt-2 items-center rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 active:opacity-90"
    >
      {loading ? (
        <ActivityIndicator size="small" color={Theme.colors.primary} />
      ) : (
        <Text className="text-sm font-bold text-foreground">Load more</Text>
      )}
    </Pressable>
  );
}
