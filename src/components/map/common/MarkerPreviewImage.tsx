import React from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { useSignedStorageUrl } from '~/hooks/useSignedStorageUrl';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { WEB_INFO_IMAGE_H } from '~/constants/map/mapUi';
import { Theme } from '~/shared/theme/Theme';
import { nativeMarkerStyles as styles } from '~/components/map/common/nativeMarkerStyles';
import { isHttpUrl } from '~/utils/general';

type Props = {
  imageUrl?: string;
  imageStoragePath?: string | null;
  variant: 'nativeTooltip' | 'webCard';
};

export function MarkerPreviewImage({ imageUrl, imageStoragePath, variant }: Props) {
  const http = imageUrl?.trim() && isHttpUrl(imageUrl.trim()) ? imageUrl.trim() : undefined;
  const path = !http && imageStoragePath?.trim() ? imageStoragePath.trim() : '';
  const { uri, loading } = useSignedStorageUrl(REX_IMAGES_BUCKET, http ? '' : path);
  const uriToShow = http ?? uri;

  const imgStyle =
    variant === 'nativeTooltip'
      ? styles.tooltipImage
      : { width: '100%' as const, height: WEB_INFO_IMAGE_H };

  if (!http && path && (loading || !uriToShow)) {
    return (
      <View
        style={[
          imgStyle,
          {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Theme.colors.border,
          },
        ]}
      >
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }

  if (!uriToShow) return null;

  return (
    <Image
      source={{ uri: uriToShow }}
      style={imgStyle}
      resizeMode="cover"
      accessibilityIgnoresInvertColors
    />
  );
}
