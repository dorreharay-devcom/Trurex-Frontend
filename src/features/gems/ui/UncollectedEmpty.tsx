import React from 'react';
import { Text, View } from 'react-native';
import { PackageOpen } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  loading: boolean;
  hasSearch: boolean;
};

function UncollectedEmpty({ loading, hasSearch }: Props) {
  if (loading) return null;

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
