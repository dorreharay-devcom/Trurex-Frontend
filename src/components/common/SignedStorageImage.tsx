import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import type { ImageStyle } from 'expo-image';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { Skeleton } from '~/components/ui/skeleton';
import { cn } from '~/utils/general';
import { isHttpUrl } from '~/utils/recommendation/recContentDisplay';
import {
  isRexPlaceholderPhotoPath,
  REX_PLACEHOLDER_IMAGE_SOURCE,
} from '~/constants/rexPlaceholderPhoto';

type Props = {
  bucket: string;
  storagePath?: string | null;
  remoteUri?: string | null;
  className?: string;
  style?: ImageStyle;
  accessibilityLabel?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: (e: { source: { width: number; height: number } }) => void;
  skeletonUntilLoaded?: boolean;
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
  skeletonUntilLoaded = false,
}: Props) {
  const http = remoteUri?.trim() && isHttpUrl(remoteUri.trim()) ? remoteUri.trim() : null;
  const path = storagePath?.trim() ?? '';
  const useBundledPlaceholder = !http && isRexPlaceholderPhotoPath(path);

  const { uri, loading } = useSignedStorageUrl(bucket, http || useBundledPlaceholder ? '' : path);
  const displayUri = http ?? uri;

  const [decoded, setDecoded] = useState(false);
  useEffect(() => {
    setDecoded(false);
  }, [displayUri]);

  if (useBundledPlaceholder) {
    return (
      <View
        className={cn(
          'relative overflow-hidden',
          skeletonUntilLoaded ? 'bg-transparent' : 'bg-muted',
          className,
        )}
        style={style}
      >
        <Image
          source={REX_PLACEHOLDER_IMAGE_SOURCE}
          className="h-full w-full"
          style={{ width: '100%', height: '100%' }}
          contentFit={contentFit}
          accessibilityLabel={accessibilityLabel}
          onLoad={(e) => {
            setDecoded(true);
            onLoad?.(e);
          }}
        />
      </View>
    );
  }

  if (!displayUri) {
    return (
      <View
        className={cn(skeletonUntilLoaded ? 'bg-transparent' : 'bg-muted', className)}
        style={style}
      >
        {loading ? (
          <Skeleton
            className={cn(
              'h-full w-full',
              skeletonUntilLoaded ? 'rounded-none bg-muted/40' : 'bg-muted/60',
            )}
          />
        ) : null}
      </View>
    );
  }

  return (
    <View
      className={cn(
        'relative overflow-hidden',
        skeletonUntilLoaded ? 'bg-transparent' : 'bg-muted',
        className,
      )}
      style={style}
    >
      {skeletonUntilLoaded && !decoded ? (
        <View className="absolute inset-0 z-[1]" pointerEvents="none">
          <Skeleton className="h-full w-full rounded-none bg-muted/40" />
        </View>
      ) : null}
      <Image
        source={{ uri: displayUri }}
        className={cn('h-full w-full', skeletonUntilLoaded && !decoded && 'opacity-0')}
        style={{ width: '100%', height: '100%' }}
        contentFit={contentFit}
        transition={skeletonUntilLoaded ? 0 : 200}
        cachePolicy="memory-disk"
        accessibilityLabel={accessibilityLabel}
        onLoad={(e) => {
          setDecoded(true);
          onLoad?.(e);
        }}
        onError={() => setDecoded(true)}
      />
    </View>
  );
}
