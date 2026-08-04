import type { ImageStyle } from 'expo-image';
import type { StorageImageTransform } from '~/shared/lib/media/imageTransform';

export type SignedStorageImageLoadEvent = {
  source: { width: number; height: number };
};

export type SignedStorageImageProps = {
  bucket: string;
  storagePath?: string | null;
  remoteUri?: string | null;
  className?: string;
  style?: ImageStyle;
  accessibilityLabel?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: (e: SignedStorageImageLoadEvent) => void;
  skeletonUntilLoaded?: boolean;
  cacheVersion?: string | number;
  imageTransform?: StorageImageTransform | null;
  recyclingKey?: string | null;
  priority?: 'low' | 'normal' | 'high' | null;
};
