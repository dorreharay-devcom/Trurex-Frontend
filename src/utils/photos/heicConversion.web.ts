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

function toJpegFileName(fileName?: string | null): string | null | undefined {
  return fileName?.replace(/\.(heic|heif)$/i, '.jpg');
}

export async function convertHeicIfNeeded(image: MaybeHeicImage): Promise<HeicConversionResult> {
  if (!isHeicImage(image)) {
    return {
      ...image,
      converted: false,
    };
  }

  const source = await fetch(image.uri).then((response) => response.blob());
  const converted = await heic2any({
    blob: source,
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
