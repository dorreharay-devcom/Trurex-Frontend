import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void | Promise<void>;
};

function QueryListFooter({ loading, isError, onRetry }: Props) {
  if (isError) {
    return <QueryErrorState compact title="Couldn't load more" onRetry={onRetry} />;
  }
  if (!loading) return null;
  return (
    <View className="items-center py-4">
      <ActivityIndicator size="small" color={Theme.colors.primary} />
    </View>
  );
}

export default QueryListFooter;
