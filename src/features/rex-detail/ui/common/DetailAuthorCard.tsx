import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import { Theme } from '~/shared/theme/Theme';
import ThankRexButton from './ThankRexButton';

type Props = {
  name: string;
  avatar: string;
  authorId: string | undefined | null;
  onPress: () => void;
  rexId: string;
  isThanked: boolean;
  showThankButton: boolean;
};

function DetailAuthorCard({
  name,
  avatar,
  authorId,
  onPress,
  rexId,
  isThanked,
  showThankButton,
}: Props) {
  return (
    <View className="flex-row items-center gap-3 rounded-xl bg-border/40 p-4">
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`View ${name}'s profile`}
        className="flex-1 flex-row items-center gap-3 active:opacity-90"
      >
        <SignedUserAvatar name={name} avatar={avatar} className="h-10 w-10" />
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Recommended by</Text>
          <Text className="font-semibold text-foreground">{name}</Text>
        </View>
      </Pressable>
      {showThankButton && <ThankRexButton rexId={rexId} initialThanked={isThanked} />}
      {authorId && (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`View ${name}'s profile`}
        >
          <ChevronRight size={16} color={Theme.colors.secondaryText} />
        </Pressable>
      )}
    </View>
  );
}

export default DetailAuthorCard;
