import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { Theme } from '~/theme/Theme';

type Props = {
  bucket: string;
  path: string;
  size: number;
};

export function SignedRexThumb({ bucket, path, size }: Props) {
  const { uri, loading } = useSignedStorageUrl(bucket, path);

  if (loading || !uri) {
    return (
      <View
        style={{ width: size, height: size }}
        className="rounded-xl border border-border bg-muted items-center justify-center"
      >
        <ActivityIndicator size="small" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: 12 }}
      contentFit="cover"
      transition={120}
    />
  );
}
