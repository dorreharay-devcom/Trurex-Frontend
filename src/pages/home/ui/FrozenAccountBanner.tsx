import React from 'react';
import { Text, View } from 'react-native';
import { useUserConfig } from '~/features/auth/hooks/useUserConfig';

function FrozenAccountBanner() {
  const { isAccountFrozen } = useUserConfig();
  if (!isAccountFrozen) return null;

  return (
    <View className="w-full items-center bg-primary/45 px-4 py-3">
      <Text className="text-base font-bold text-primary-foreground">
        ❗ Your account is frozen by the admin
      </Text>
    </View>
  );
}

export default FrozenAccountBanner;
