import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import { Theme } from '~/shared/theme/Theme';
import BusinessAuthorTag from '~/shared/ui/primitives/BusinessAuthorTag';
import ThankRexButton from './ThankRexButton';

type Props = {
  name: string;
  avatar: string;
  authorId: string | undefined | null;
  authorTierIcon?: string | null;
  verified?: boolean;
  postedAsBusiness?: boolean;
  onPress: () => void;
  rexId: string;
  isThanked: boolean;
  showThankButton: boolean;
};

function DetailAuthorCard({
  name,
  avatar,
  authorId,
  authorTierIcon,
  verified,
  postedAsBusiness,
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
        <SignedUserAvatar name={name} avatar={avatar} verified={verified} className="h-10 w-10" />
        <View className="flex-1">
          <Text className="text-sm text-muted-foreground">Recommended by</Text>
          <View className="min-w-0 flex-row items-center gap-1.5">
            <Text className="shrink font-semibold text-foreground">{name}</Text>
            {authorTierIcon ? <Text className="text-xs">{authorTierIcon}</Text> : null}
            {postedAsBusiness ? <BusinessAuthorTag /> : null}
          </View>
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
