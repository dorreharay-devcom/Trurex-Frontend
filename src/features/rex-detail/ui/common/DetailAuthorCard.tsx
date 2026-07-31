import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { SignedUserAvatar } from '~/components/common/SignedUserAvatar';
import { Theme } from '~/shared/theme/Theme';

type Props = {
  name: string;
  avatar: string;
  authorId: string | undefined | null;
  onPress: () => void;
};

function DetailAuthorCard({ name, avatar, authorId, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View ${name}'s profile`}
      className="flex-row items-center gap-3 rounded-xl bg-border/40 p-4 active:opacity-90"
    >
      <SignedUserAvatar name={name} avatar={avatar} className="h-10 w-10" />
      <View className="flex-1">
        <Text className="text-sm text-muted-foreground">Recommended by</Text>
        <Text className="font-semibold text-foreground">{name}</Text>
      </View>
      {authorId && <ChevronRight size={16} color={Theme.colors.secondaryText} />}
    </Pressable>
  );
}

export default DetailAuthorCard;
