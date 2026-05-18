import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { RexPlaceholderHtml } from '~/components/common/RexPlaceholderHtml';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import type { Recommendation } from '~/types/recommendation/recommendation';
import { cn } from '~/utils/general';
import {
  rexCoverRemoteHttpUrl,
  rexCoverStoragePathFromRecommendation,
} from '~/utils/recommendation/recContentDisplay';

type Props = {
  rec: Pick<Recommendation, 'title' | 'rexPlaceholderHtml' | 'photoPath' | 'image'>;
  className?: string;
  imageClassName?: string;
};

export function RexCoverThumbnail({ rec, className = 'h-12 w-12 rounded-lg', imageClassName }: Props) {
  const placeholderHtml = rec.rexPlaceholderHtml?.trim() || null;

  if (placeholderHtml) {
    return (
      <View className={cn('relative shrink-0 overflow-hidden bg-transparent', className)}>
        <RexPlaceholderHtml html={placeholderHtml} style={StyleSheet.absoluteFillObject} />
      </View>
    );
  }

  return (
    <View className={cn('shrink-0 overflow-hidden bg-muted', className)}>
      <SignedStorageImage
        bucket={REX_IMAGES_BUCKET}
        storagePath={rexCoverStoragePathFromRecommendation(rec)}
        remoteUri={rexCoverRemoteHttpUrl(rec)}
        className={cn('h-full w-full', imageClassName)}
        accessibilityLabel={rec.title}
      />
    </View>
  );
}
