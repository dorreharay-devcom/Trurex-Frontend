import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Theme } from '~/shared/theme/Theme';
import ReferredUserRow from '~/features/referrals/ui/ReferredUserRow';
import type { ReferredUser } from '~/features/referrals/types/referral';

type Props = {
  users: ReferredUser[];
  loading: boolean;
  totalReferrals: number;
  onUserPress: (userId: string) => void;
};

function ReferredUsersList({ users, loading, totalReferrals, onUserPress }: Props) {
  return (
    <View className="gap-3">
      <View className="h-px bg-border" />

      {loading ? (
        <View className="items-center py-6">
          <ActivityIndicator color={Theme.colors.muted} />
        </View>
      ) : users.length === 0 ? (
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-foreground">{totalReferrals} joined</Text>
          <Text className="text-sm text-muted-foreground">Your referrals will appear here.</Text>
        </View>
      ) : (
        <>
          <Text className="text-sm font-semibold text-foreground">{totalReferrals} joined</Text>
          {users.map((user) => (
            <ReferredUserRow key={user.id} user={user} onPress={() => onUserPress(user.id)} />
          ))}
        </>
      )}
    </View>
  );
}

export default ReferredUsersList;
