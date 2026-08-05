import React, { type ReactNode } from 'react';
import { Text, View } from 'react-native';
import { SignedUserAvatar } from '~/shared/ui/media/SignedUserAvatar';
import ProfileChevronButton from '~/features/circles/ui/common/rows/ProfileChevronButton';
import ProfileTapArea from '~/features/circles/ui/common/rows/ProfileTapArea';

type Props = {
  userId: string;
  name: string;
  handle: string | null;
  avatarUrl: string | null;
  avatarName?: string;
  onUserPress?: (userId: string) => void;
  children?: ReactNode;
};

const ConnectionRowShell = ({
  userId,
  name,
  handle,
  avatarUrl,
  avatarName,
  onUserPress,
  children,
}: Props) => {
  const pressProfile = onUserPress ? () => onUserPress(userId) : undefined;

  return (
    <View className="flex-row items-center gap-3 rounded-xl border border-border bg-card p-3">
      <ProfileTapArea label={name} onPress={pressProfile}>
        <SignedUserAvatar name={avatarName ?? name} avatar={avatarUrl} className="h-10 w-10" />
        <View className="min-w-0 flex-1">
          <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
            {name}
          </Text>
          {handle && (
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>
              @{handle}
            </Text>
          )}
        </View>
      </ProfileTapArea>
      {children}
      <ProfileChevronButton label={name} onPress={pressProfile} />
    </View>
  );
};

export default ConnectionRowShell;
