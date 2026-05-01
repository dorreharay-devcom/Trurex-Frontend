import React from 'react';
import { View, Text } from 'react-native';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { USER_AVATARS_BUCKET } from '~/constants/storageBuckets';
import { userAvatarHttpUrl, userAvatarStoragePath } from '~/utils/recommendation/recContentDisplay';
import { cn } from '~/utils/general';

type Props = {
  name: string;
  avatar?: string | null;
  className?: string;
};

export function SignedUserAvatar({ name, avatar, className }: Props) {
  const path = userAvatarStoragePath(avatar);
  const http = userAvatarHttpUrl(avatar);
  const base = 'rounded-full border-2 border-border';

  if (!path && !http) {
    return (
      <View className={cn('h-9 w-9 items-center justify-center bg-muted', base, className)}>
        <Text className="text-sm font-semibold text-muted-foreground">
          {name.trim().charAt(0).toUpperCase() || '?'}
        </Text>
      </View>
    );
  }

  return (
    <View className={cn('h-9 w-9 overflow-hidden', base, className)}>
      <SignedStorageImage
        bucket={USER_AVATARS_BUCKET}
        storagePath={path}
        remoteUri={http}
        style={{ width: '100%', height: '100%' }}
        accessibilityLabel={name}
      />
    </View>
  );
}
