import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import ReferredUserRow from '~/features/referrals/ui/ReferredUserRow';
import type { ReferredUser } from '~/features/referrals/types/referral';

type Props = {
  users: ReferredUser[];
  loading: boolean;
  onUserPress: (userId: string) => void;
};

function ReferredUsersList({ users, loading, onUserPress }: Props) {
  if (loading) {
    return (
      <View className="items-center py-10">
        <ActivityIndicator color={Theme.colors.muted} />
      </View>
    );
  }

  if (users.length === 0) {
    return (
      <View className="items-center gap-2 py-10">
        <Text className="text-sm font-medium text-foreground">No referrals yet</Text>
        <Text className="text-center text-xs text-muted-foreground">
          Share your code above to start earning rewards.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-foreground">Your referrals</Text>
      {users.map((user) => (
        <ReferredUserRow key={user.id} user={user} onPress={() => onUserPress(user.id)} />
      ))}
    </View>
  );
}

export default ReferredUsersList;
