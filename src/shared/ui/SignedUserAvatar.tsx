import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { SignedStorageImage } from '~/shared/ui/SignedStorageImage';
import { USER_AVATARS_BUCKET } from '~/shared/config/app';
import { isHttpUrl } from '~/shared/lib/data/guards';
import { cn } from '~/shared/lib/ui/styles';
import { avatarImageTransform } from '~/shared/lib/media/imageTransform';

type Props = {
  name: string;
  avatar?: string | null;
  className?: string;
  cacheVersion?: string | number;
  sizePt?: number;
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

export function SignedUserAvatar({ name, avatar, className, cacheVersion, sizePt = 40 }: Props) {
  const path = userAvatarStoragePath(avatar);
  const http = userAvatarHttpUrl(avatar);
  const base = 'rounded-full border-2 border-border';
  const transform = useMemo(() => avatarImageTransform(sizePt), [sizePt]);
  const recyclingKey = path || http || name;

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
        className="absolute inset-0"
        accessibilityLabel={name}
        cacheVersion={cacheVersion}
        imageTransform={transform}
        recyclingKey={recyclingKey}
        priority="low"
      />
    </View>
  );
}
