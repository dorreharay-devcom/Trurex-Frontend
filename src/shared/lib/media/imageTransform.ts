import { Dimensions, PixelRatio } from 'react-native';

export type StorageImageTransform = {
  width?: number;
  height?: number;
  resize?: 'cover' | 'contain' | 'fill';
  quality?: number;
  format?: 'origin';
};

export function imageTransformCacheSuffix(transform?: StorageImageTransform | null): string {
  if (!transform) return '';
  const w = transform.width ?? '';
  const h = transform.height ?? '';
  const r = transform.resize ?? '';
  const q = transform.quality ?? '';
  const f = transform.format ?? '';
  return `:tx${w}x${h}_${r}_q${q}_${f}`;
}

function deviceScale(): number {
  return Math.min(PixelRatio.get(), 3);
}

export function feedCoverImageTransform(): StorageImageTransform {
  const screenW = Dimensions.get('window').width;
  const cardW = Math.min(Math.max(screenW - 32, 280), 680);
  const width = Math.min(900, Math.round(cardW * deviceScale()));
  const height = Math.round((width * 3) / 4);
  return {
    width,
    height,
    resize: 'cover',
    quality: 70,
  };
}

export function listThumbImageTransform(sizePt = 48): StorageImageTransform {
  const side = Math.min(256, Math.round(sizePt * deviceScale()));
  return {
    width: side,
    height: side,
    resize: 'cover',
    quality: 65,
  };
}

export function gridCoverImageTransform(cellWidthPt: number): StorageImageTransform {
  const side = Math.min(640, Math.round(Math.max(cellWidthPt, 80) * deviceScale()));
  return {
    width: side,
    height: side,
    resize: 'cover',
    quality: 70,
  };
}

export function avatarImageTransform(sizePt = 40): StorageImageTransform {
  const side = Math.min(256, Math.round(Math.max(sizePt, 24) * deviceScale()));
  return {
    width: side,
    height: side,
    resize: 'cover',
    quality: 70,
  };
}
