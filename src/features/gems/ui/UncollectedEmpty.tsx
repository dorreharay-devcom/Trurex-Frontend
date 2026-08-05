import React from 'react';
import { Text, View } from 'react-native';
import { PackageOpen } from 'lucide-react-native';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  loading: boolean;
  isError?: boolean;
  hasSearch: boolean;
  onRetry?: () => void;
};

function UncollectedEmpty({ loading, isError, hasSearch, onRetry }: Props) {
  if (loading) return null;

  if (isError) {
    return <QueryErrorState title="Couldn't load uncollected" onRetry={onRetry} />;
  }

  return (
    <View className="items-center py-10 gap-2">
      <PackageOpen size={28} color={Theme.colors.muted} />
      <Text className="text-sm text-muted-foreground">
        {hasSearch ? 'No matches' : 'All your Rex are in collections. Nice work.'}
      </Text>
    </View>
  );
}

export default UncollectedEmpty;
