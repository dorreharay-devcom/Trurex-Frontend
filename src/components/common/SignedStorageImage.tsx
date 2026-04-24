import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { useImageContentFit } from '~/hooks/useImageContentFit';
import { cn } from '~/utils/general';
import { isHttpUrl } from '~/utils/recommendation/rexMediaPaths';

type Props = {
  bucket: string;
  storagePath?: string | null;
  remoteUri?: string | null;
  className?: string;
  accessibilityLabel?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  adaptiveContentFit?: boolean;
};

export function SignedStorageImage({
  bucket,
  storagePath,
  remoteUri,
  className,
  accessibilityLabel,
  contentFit = 'cover',
  adaptiveContentFit = false,
}: Props) {
  const http = remoteUri?.trim() && isHttpUrl(remoteUri.trim()) ? remoteUri.trim() : null;
  const path = storagePath?.trim() ?? '';

  const { uri } = useSignedStorageUrl(bucket, http ? '' : path);
  const displayUri = http ?? uri;

  const detectedFit = useImageContentFit(adaptiveContentFit ? displayUri : null);
  const resolvedFit = adaptiveContentFit ? detectedFit : contentFit;

  if (!displayUri) {
    return <View className={cn('bg-muted', className)} />;
  }

  return (
    <Image
      source={{ uri: displayUri }}
      className={className}
      contentFit={resolvedFit}
      transition={200}
      cachePolicy="memory-disk"
      accessibilityLabel={accessibilityLabel}
    />
  );
}
