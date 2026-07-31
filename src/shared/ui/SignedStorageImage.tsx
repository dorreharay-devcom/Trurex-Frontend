import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import type { ImageStyle } from 'expo-image';
import { useSignedStorageUrl } from '~/shared/hooks/useSignedStorageUrl';
import { Skeleton } from '~/shared/ui/Skeleton';
import { cn, isHttpUrl } from '~/utils/general';
import { isRexPlaceholderPhotoPath, REX_PLACEHOLDER_IMAGE_SOURCE } from '~/shared/lib/rexImages';

const SIGNED_URL_TTL_SECONDS = 3600;
const FADE_TRANSITION_MS = 200;

type ImageLoadEvent = { source: { width: number; height: number } };

type Props = {
  bucket: string;
  storagePath?: string | null;
  remoteUri?: string | null;
  className?: string;
  style?: ImageStyle;
  accessibilityLabel?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: (e: ImageLoadEvent) => void;
  skeletonUntilLoaded?: boolean;
  cacheVersion?: string | number;
};

function resolveHttpUri(remoteUri: string | null | undefined): string | null {
  const trimmed = remoteUri?.trim();
  if (!trimmed || !isHttpUrl(trimmed)) return null;
  return trimmed;
}

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
  cacheVersion,
}: Props) {
  const http = resolveHttpUri(remoteUri);
  const path = storagePath?.trim() ?? '';
  const useBundledPlaceholder = !http && isRexPlaceholderPhotoPath(path);
  const signedPath = http || useBundledPlaceholder ? '' : path;

  const { uri, loading } = useSignedStorageUrl(
    bucket,
    signedPath,
    SIGNED_URL_TTL_SECONDS,
    cacheVersion,
  );
  const displayUri = http ?? uri;

  const [decoded, setDecoded] = useState(false);
  useEffect(() => {
    setDecoded(false);
  }, [displayUri]);

  const backgroundClass = skeletonUntilLoaded ? 'bg-transparent' : 'bg-muted';
  const containerClass = cn('relative overflow-hidden', backgroundClass, className);
  const showSkeletonOverlay = skeletonUntilLoaded && !decoded;

  const handleLoad = (e: ImageLoadEvent) => {
    setDecoded(true);
    onLoad?.(e);
  };

  if (useBundledPlaceholder) {
    return (
      <View className={containerClass} style={style}>
        <Image
          source={REX_PLACEHOLDER_IMAGE_SOURCE}
          className="h-full w-full"
          style={{ width: '100%', height: '100%' }}
          contentFit={contentFit}
          accessibilityLabel={accessibilityLabel}
          onLoad={handleLoad}
        />
      </View>
    );
  }

  if (!displayUri) {
    return (
      <View className={cn(backgroundClass, className)} style={style}>
        {loading && (
          <Skeleton
            className={cn(
              'h-full w-full',
              skeletonUntilLoaded ? 'rounded-none bg-muted/40' : 'bg-muted/60',
            )}
          />
        )}
      </View>
    );
  }

  return (
    <View className={containerClass} style={style}>
      {showSkeletonOverlay && (
        <View className="absolute inset-0 z-[1]" pointerEvents="none">
          <Skeleton className="h-full w-full rounded-none bg-muted/40" />
        </View>
      )}
      <Image
        source={{ uri: displayUri }}
        className={cn('h-full w-full', showSkeletonOverlay && 'opacity-0')}
        style={{ width: '100%', height: '100%' }}
        contentFit={contentFit}
        transition={skeletonUntilLoaded ? 0 : FADE_TRANSITION_MS}
        cachePolicy="memory-disk"
        accessibilityLabel={accessibilityLabel}
        onLoad={handleLoad}
        onError={() => setDecoded(true)}
      />
    </View>
  );
}
