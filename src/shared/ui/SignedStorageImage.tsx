import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Image, type ImageStyle } from 'expo-image';
import { useSignedStorageUrl } from '~/shared/hooks/useSignedStorageUrl';
import { Skeleton } from '~/shared/ui/Skeleton';
import { isHttpUrl } from '~/shared/lib/data/guards';
import { cn } from '~/shared/lib/ui/styles';
import {
  isRexPlaceholderPhotoPath,
  REX_PLACEHOLDER_IMAGE_SOURCE,
} from '~/shared/lib/media/rexImages';

const SIGNED_URL_TTL_SECONDS = 3600;
const FADE_TRANSITION_MS = 200;
const FILL_STYLE: ImageStyle = { width: '100%', height: '100%' };

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

type Display =
  | { kind: 'bundled' }
  | { kind: 'remote'; uri: string }
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
  const bundled = !http && isRexPlaceholderPhotoPath(path);
  const signedPath = http || bundled ? '' : path;

  const { uri, loading } = useSignedStorageUrl(
    bucket,
    signedPath,
    SIGNED_URL_TTL_SECONDS,
    cacheVersion,
  );

  const display: Display = (() => {
    if (bundled) return { kind: 'bundled' };
    const remote = http ?? uri;
    if (remote) return { kind: 'remote', uri: remote };
    if (loading) return { kind: 'pending' };
    return { kind: 'empty' };
  })();

  const sourceKey = display.kind === 'remote' ? display.uri : display.kind;
  const [decoded, setDecoded] = useState(false);
  useEffect(() => {
    setDecoded(false);
  }, [sourceKey]);

  const markDecoded = (e?: ImageLoadEvent) => {
    setDecoded(true);
    if (e) onLoad?.(e);
  };

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
          onLoad={(e) => markDecoded(e)}
        />
      ) : null}

      {display.kind === 'remote' ? (
        <Image
          source={{ uri: display.uri }}
          style={[FILL_STYLE, waitingToDecode ? { opacity: 0 } : null]}
          contentFit={contentFit}
          transition={skeletonUntilLoaded ? 0 : FADE_TRANSITION_MS}
          cachePolicy="memory-disk"
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
}
