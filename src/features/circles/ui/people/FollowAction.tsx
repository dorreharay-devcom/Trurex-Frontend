import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  isFollowing: boolean;
  pending: boolean;
  onFollow: () => void;
};

const FollowAction = ({ isFollowing, pending, onFollow }: Props) => {
  if (isFollowing) {
    return (
      <View className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5">
        <Text className="text-xs font-semibold text-foreground">Following</Text>
      </View>
    );
  }
  return (
    <Pressable
      onPress={onFollow}
      disabled={pending}
      className="flex-row items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 active:opacity-90 disabled:opacity-50"
    >
      <UserPlus size={14} color={Theme.colors.primaryForeground} />
      <Text className="text-xs font-semibold text-primary-foreground">Follow</Text>
    </Pressable>
  );
};

export default FollowAction;
