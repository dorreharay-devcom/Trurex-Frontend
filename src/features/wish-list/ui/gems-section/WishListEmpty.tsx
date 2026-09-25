import React from 'react';
import { Text, View } from 'react-native';
import { Heart } from 'lucide-react-native';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  isError?: boolean;
  onRetry?: () => void;
};

function WishListEmpty({ isError, onRetry }: Props) {
  if (isError) {
    return <QueryErrorState compact title="Couldn't load your Wish List" onRetry={onRetry} />;
  }

  return (
    <View className="items-center py-10 gap-2">
      <Heart size={28} color={Theme.colors.muted} />
      <Text className="text-sm text-muted-foreground">No wish list items yet</Text>
    </View>
  );
}

export default WishListEmpty;
