import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';
import { isHttpUrl } from '~/utils/recommendation/rexMediaPaths';

type Props = {
  bucket: string;
  storagePath?: string | null;
  remoteUri?: string | null;
  className?: string;
  accessibilityLabel?: string;
};

export function SignedStorageImage({
  bucket,
  storagePath,
  remoteUri,
  className,
  accessibilityLabel,
}: Props) {
  const http = remoteUri?.trim() && isHttpUrl(remoteUri.trim()) ? remoteUri.trim() : null;
  const path = storagePath?.trim() ?? '';

  const { uri, loading } = useSignedStorageUrl(bucket, http ? '' : path);

  const displayUri = http ?? uri;

  if (!http && path && (loading || !displayUri)) {
    return (
      <View className={cn('items-center justify-center bg-muted', className)}>
        <ActivityIndicator size="small" color={Theme.colors.primary} />
      </View>
    );
  }

  if (!displayUri) {
    return <View className={cn('bg-muted', className)} />;
  }

  return (
    <Image
      source={{ uri: displayUri }}
      className={className}
      contentFit="cover"
      transition={120}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
