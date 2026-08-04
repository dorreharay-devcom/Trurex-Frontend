import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, type ImageStyle } from 'expo-image';
import { useSignedStorageUrl } from '~/shared/hooks/useSignedStorageUrl';
import { Skeleton } from '~/shared/ui/Skeleton';
import { isHttpUrl } from '~/shared/lib/data/guards';
import { cn } from '~/shared/lib/ui/styles';
import {
  isRexPlaceholderPhotoPath,
  REX_PLACEHOLDER_IMAGE_SOURCE,
} from '~/shared/lib/media/rexImages';
import type {
  SignedStorageImageLoadEvent,
  SignedStorageImageProps,
} from '~/shared/ui/SignedStorageImage.types';

export type { SignedStorageImageProps } from '~/shared/ui/SignedStorageImage.types';

const SIGNED_URL_TTL_SECONDS = 3600;
const FADE_TRANSITION_MS = 200;
const FILL_STYLE: ImageStyle = StyleSheet.absoluteFillObject;

type Display =
  | { kind: 'bundled' }
  | { kind: 'remote'; uri: string; cacheKey?: string }
  | { kind: 'pending' }
  | { kind: 'empty' };

function resolveHttpUri(remoteUri: string | null | undefined): string | null {
  const trimmed = remoteUri?.trim();
  if (!trimmed || !isHttpUrl(trimmed)) return null;
  return trimmed;
}

function LoadingSkeleton({ soft }: { soft: boolean }) {
  return (
    <Skeleton className={cn('h-full w-full rounded-none', soft ? 'bg-muted/40' : 'bg-muted/60')} />
  );
}

export const SignedStorageImage: React.FC<SignedStorageImageProps> = ({
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
  imageTransform,
  recyclingKey,
  priority,
}) => {
  const http = resolveHttpUri(remoteUri);
  const path = storagePath?.trim() ?? '';
  const bundled = !http && isRexPlaceholderPhotoPath(path);
  const signedPath = http || bundled ? '' : path;
  const activeTransform = http || bundled ? null : (imageTransform ?? null);

  const { uri, loading, cacheKey } = useSignedStorageUrl(
    bucket,
    signedPath,
    SIGNED_URL_TTL_SECONDS,
    cacheVersion,
    activeTransform,
  );

  const display: Display = (() => {
    if (bundled) return { kind: 'bundled' };
    if (http) return { kind: 'remote', uri: http, cacheKey: http };
    if (uri) return { kind: 'remote', uri, cacheKey: cacheKey || uri };
    if (loading) return { kind: 'pending' };
    return { kind: 'empty' };
  })();

  const sourceKey = display.kind === 'remote' ? (display.cacheKey ?? display.uri) : display.kind;
  const [decoded, setDecoded] = useState(false);
  useEffect(() => {
    setDecoded(false);
  }, [sourceKey]);

  const markDecoded = (e?: SignedStorageImageLoadEvent) => {
    setDecoded(true);
    if (e) onLoad?.(e);
  };

  const remoteUriStable = display.kind === 'remote' ? display.uri : null;
  const remoteCacheKey = display.kind === 'remote' ? (display.cacheKey ?? display.uri) : null;
  const remoteSource = useMemo(() => {
    if (!remoteUriStable) return null;
    return {
      uri: remoteUriStable,
      cacheKey: remoteCacheKey ?? remoteUriStable,
    };
  }, [remoteUriStable, remoteCacheKey]);

  const waitingToDecode = skeletonUntilLoaded && display.kind === 'remote' && !decoded;
  const showSkeleton = display.kind === 'pending' || waitingToDecode;

  return (
    <View
      className={cn(
        'relative overflow-hidden',
        skeletonUntilLoaded ? 'bg-transparent' : 'bg-muted',
        className,
      )}
      style={style}
    >
      {display.kind === 'bundled' ? (
        <Image
          source={REX_PLACEHOLDER_IMAGE_SOURCE}
          style={FILL_STYLE}
          contentFit={contentFit}
          accessibilityLabel={accessibilityLabel}
          recyclingKey={recyclingKey}
          onLoad={(e) => markDecoded(e)}
        />
      ) : null}

      {display.kind === 'remote' && remoteSource ? (
        <Image
          source={remoteSource}
          style={[FILL_STYLE, waitingToDecode ? { opacity: 0 } : null]}
          contentFit={contentFit}
          transition={skeletonUntilLoaded ? 0 : FADE_TRANSITION_MS}
          cachePolicy="memory-disk"
          recyclingKey={recyclingKey}
          priority={priority}
          accessibilityLabel={accessibilityLabel}
          onLoad={(e) => markDecoded(e)}
          onError={() => markDecoded()}
        />
      ) : null}

      {showSkeleton ? (
        <View className="absolute inset-0 z-[1]" pointerEvents="none">
          <LoadingSkeleton soft={skeletonUntilLoaded} />
        </View>
      ) : null}
    </View>
  );
};
