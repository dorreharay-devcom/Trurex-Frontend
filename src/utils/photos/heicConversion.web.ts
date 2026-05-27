import heic2any from 'heic2any';
import type { HeicConversionResult, MaybeHeicImage } from './heicConversion';

const HEIC_MIME_TYPES = new Set([
  'image/heic',
  'image/heif',
  'image/heic-sequence',
  'image/heif-sequence',
]);

function isHeicImage({ fileName, mimeType }: MaybeHeicImage): boolean {
  return (
    HEIC_MIME_TYPES.has((mimeType ?? '').toLowerCase()) || /\.(heic|heif)$/i.test(fileName ?? '')
  );
}

function needsHeicSniff({ fileName, mimeType }: MaybeHeicImage): boolean {
  if (mimeType?.trim()) return false;
  return !/\.(jpe?g|png|webp|gif|bmp|heic|heif)$/i.test(fileName ?? '');
}

async function blobLooksLikeHeic(blob: Blob): Promise<boolean> {
  const header = await blob.slice(0, 32).arrayBuffer();
  const text = String.fromCharCode(...new Uint8Array(header));
  if (!text.includes('ftyp')) return false;
  return /heic|heix|hevc|hevx|heif|mif1|msf1/i.test(text);
}

function toJpegFileName(fileName?: string | null): string {
  if (!fileName?.trim()) return `photo-${Date.now()}.jpg`;
  if (/\.(heic|heif)$/i.test(fileName)) return fileName.replace(/\.(heic|heif)$/i, '.jpg');
  if (/\.[a-z0-9]+$/i.test(fileName)) return fileName.replace(/\.[a-z0-9]+$/i, '.jpg');
  return `${fileName}.jpg`;
}

export async function convertHeicIfNeeded(image: MaybeHeicImage): Promise<HeicConversionResult> {
  let source: Blob | undefined;
  let shouldConvert = isHeicImage(image);

  if (!shouldConvert && needsHeicSniff(image)) {
    const sniffSource = await fetch(image.uri).then((response) => response.blob());
    source = sniffSource;
    shouldConvert = await blobLooksLikeHeic(sniffSource);
  }

  if (!shouldConvert) {
    return {
      ...image,
      converted: false,
    };
  }

  const sourceBlob: Blob = source ?? (await fetch(image.uri).then((response) => response.blob()));
  const converted = await heic2any({
    blob: sourceBlob,
    toType: 'image/jpeg',
    quality: 0.82,
  });
  const blob = Array.isArray(converted) ? converted[0] : converted;

  if (!blob) throw new Error('Could not convert HEIC image.');

  const jpegBlob = blob.type === 'image/jpeg' ? blob : new Blob([blob], { type: 'image/jpeg' });
  const uri = URL.createObjectURL(jpegBlob);

  return {
    uri,
    fileName: toJpegFileName(image.fileName),
    mimeType: 'image/jpeg',
    blob: jpegBlob,
    converted: true,
    dispose: () => URL.revokeObjectURL(uri),
  };
}
