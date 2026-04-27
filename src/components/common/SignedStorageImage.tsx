import React from 'react';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { cn } from '~/utils/general';
import { isHttpUrl } from '~/utils/recommendation/rexMediaPaths';
import { Theme } from '~/theme/Theme';

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
  const t = (storagePath ?? '').trim();
  const r = (remoteUri ?? '').trim();
  const http: string | null = r && isHttpUrl(r) ? r : t && isHttpUrl(t) ? t : null;
  const path = http ? '' : t;
  const { uri, loading } = useSignedStorageUrl(bucket, path);
  const displayUri = http ?? uri;

  if (path && !http && loading) {
    return (
      <View
        className={cn('relative items-center justify-center overflow-hidden bg-muted', className)}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
      >
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

  if (!displayUri) {
    return <View className={cn('bg-muted', className)} />;
  }

  return (
    <View className={cn('relative overflow-hidden', className)}>
      <Image
        accessibilityLabel={accessibilityLabel}
        contentFit="cover"
        source={{ uri: displayUri }}
        style={StyleSheet.absoluteFillObject}
        cachePolicy={Platform.select({ web: 'memory', default: 'memory-disk' })}
        transition={120}
        recyclingKey={displayUri}
      />
    </View>
  );
}
