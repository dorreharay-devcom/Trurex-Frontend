import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import type { ImageStyle } from 'expo-image';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { cn } from '~/utils/general';
import { isHttpUrl } from '~/utils/recommendation/recContentDisplay';

type Props = {
  bucket: string;
  storagePath?: string | null;
  remoteUri?: string | null;
  className?: string;
  style?: ImageStyle;
  accessibilityLabel?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: (e: { source: { width: number; height: number } }) => void;
};

export function SignedStorageImage({
  bucket,
  storagePath,
  remoteUri,
  className,
  style,
  accessibilityLabel,
  contentFit = 'cover',
  onLoad,
}: Props) {
  const http = remoteUri?.trim() && isHttpUrl(remoteUri.trim()) ? remoteUri.trim() : null;
  const path = storagePath?.trim() ?? '';

  const { uri } = useSignedStorageUrl(bucket, http ? '' : path);
  const displayUri = http ?? uri;

  if (!displayUri) {
    return <View className={cn('bg-muted', className)} />;
  }

  return (
    <Image
      source={{ uri: displayUri }}
      className={className}
      style={style}
      contentFit={contentFit}
      transition={200}
      cachePolicy="memory-disk"
      accessibilityLabel={accessibilityLabel}
      onLoad={onLoad}
    />
  );
}
