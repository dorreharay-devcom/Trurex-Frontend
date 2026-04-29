import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import type { ImageStyle } from 'expo-image';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { Skeleton } from '~/components/ui/skeleton';
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

  const { uri, loading } = useSignedStorageUrl(bucket, http ? '' : path);
  const displayUri = http ?? uri;
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    setImageReady(false);
  }, [displayUri]);

  if (!displayUri) {
    if (loading && path) {
      return (
        <View className={cn('relative overflow-hidden', className)} style={style}>
          <Skeleton className="absolute inset-0 h-full w-full bg-muted/60" />
        </View>
      );
    }
    return <View className={cn('bg-muted', className)} style={style} />;
  }

  return (
    <View className={cn('relative overflow-hidden', className)} style={style}>
      {!imageReady ? (
        <View
          className="pointer-events-none absolute inset-0 z-[1]"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Skeleton className="h-full w-full bg-muted/50" />
        </View>
      ) : null}
      <Image
        source={{ uri: displayUri }}
        className="h-full w-full"
        contentFit={contentFit}
        transition={200}
        cachePolicy="memory-disk"
        accessibilityLabel={accessibilityLabel}
        onLoad={(e) => {
          setImageReady(true);
          onLoad?.(e);
        }}
      />
    </View>
  );
}
