import React from 'react';
import { View, Text } from 'react-native';
import { SignedStorageImage } from '~/shared/ui/SignedStorageImage';
import { USER_AVATARS_BUCKET } from '~/shared/config/storageBuckets';
import { cn, isHttpUrl } from '~/utils/general';

type Props = {
  name: string;
  avatar?: string | null;
  className?: string;
};

function userAvatarStoragePath(avatar: string | undefined | null): string | null {
  const a = avatar?.trim() ?? '';
  if (!a || isHttpUrl(a)) return null;
  return a;
}

function userAvatarHttpUrl(avatar: string | undefined | null): string | null {
  const a = avatar?.trim() ?? '';
  if (a && isHttpUrl(a)) return a;
  return null;
}

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
