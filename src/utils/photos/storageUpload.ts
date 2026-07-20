import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';
import { Backend } from '~/services/AuthService';
import { generateRexImageStoragePath } from './photoUtils';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';
import { convertHeicIfNeeded } from './heicConversion';

type UploadBody = Blob | ArrayBuffer;

const JPEG_CONTENT_TYPE = 'image/jpeg';
const isNative = Platform.OS !== 'web';
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_VALUES = BASE64_CHARS.split('').reduce<Record<string, number>>((acc, char, index) => {
  acc[char] = index;
  return acc;
}, {});

export const IMAGE_EMPTY_ERROR = 'IMAGE_EMPTY_ERROR';

export const IMAGE_EMPTY_USER_MESSAGE =
  'This photo could not be used. Please try a different one.';

export const PHOTO_UPLOAD_ERROR_MESSAGE =
  'Something went wrong with this photo. Please try again.';

export function photoUploadErrorMessage(error: unknown, fallback = PHOTO_UPLOAD_ERROR_MESSAGE): string {
  if (error instanceof Error && error.message === IMAGE_EMPTY_ERROR) {
    return IMAGE_EMPTY_USER_MESSAGE;
  }
  return fallback;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const normalized = base64.replace(/^data:[^,]+,/, '').replace(/\s/g, '');
  const padding = normalized.endsWith('==') ? 2 : normalized.endsWith('=') ? 1 : 0;
  const bytes = new Uint8Array(Math.floor((normalized.length * 3) / 4) - padding);
  let buffer = 0;
  let bits = 0;
  let offset = 0;

  for (const char of normalized) {
    if (char === '=') break;
    const value = BASE64_VALUES[char];
    if (value == null) throw new Error('Invalid image data.');

    buffer = (buffer << 6) | value;
    bits += 6;

    if (bits >= 8) {
      bits -= 8;
      bytes[offset] = (buffer >> bits) & 0xff;
      offset += 1;
    }
  }

  return bytes.buffer;
}

function jpegFileName(fileName?: string | null): string | null | undefined {
  if (!fileName) return fileName;
  return fileName.replace(/\.[^.]+$/, '') + '.jpg';
}

function isHeicLikeFile(fileName?: string | null, mimeType?: string | null): boolean {
  return (
    /\.(heic|heif)$/i.test(fileName?.trim() ?? '') ||
    /^image\/hei[cf](?:-sequence)?$/i.test(mimeType?.trim() ?? '')
  );
}

function uploadBodyByteLength(body: UploadBody): number {
  if (body instanceof ArrayBuffer) return body.byteLength;
  if (typeof Blob !== 'undefined' && body instanceof Blob) return body.size;
  return 0;
}

function assertNonEmptyUploadBody(body: UploadBody): void {
  if (uploadBodyByteLength(body) === 0) {
    throw new Error(IMAGE_EMPTY_ERROR);
  }
}

export async function resizeForUpload(
  uri: string,
  maxWidth = 1200,
): Promise<{ uri: string; base64?: string }> {
  const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: maxWidth } }], {
    compress: 0.82,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: isNative,
  });
  return { uri: result.uri, base64: result.base64 };
}

export async function fetchUriAsBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return response.blob();
}

export async function preparePickerImageForUpload(
  imageUri: string,
  fileName?: string | null,
  mimeType?: string | null,
  maxWidth = 1200,
): Promise<{ body: UploadBody; fileName?: string | null; contentType?: string }> {
  const image = await convertHeicIfNeeded({ uri: imageUri, fileName, mimeType });

  try {
    if (image.converted && image.blob) {
      assertNonEmptyUploadBody(image.blob);
      return {
        body: image.blob,
        fileName: jpegFileName(image.fileName ?? fileName),
        contentType: JPEG_CONTENT_TYPE,
      };
    }

    const resized = await resizeForUpload(image.uri, maxWidth);

    if (isNative) {
      if (!resized.base64) throw new Error('Could not read image data.');
      const body = base64ToArrayBuffer(resized.base64);
      assertNonEmptyUploadBody(body);
      return {
        body,
        fileName: jpegFileName(image.fileName ?? fileName),
        contentType: JPEG_CONTENT_TYPE,
      };
    }

    const blob = await fetchUriAsBlob(resized.uri);
    assertNonEmptyUploadBody(blob);

    return {
      body: blob,
      fileName: jpegFileName(image.fileName ?? fileName),
      contentType: JPEG_CONTENT_TYPE,
    };
  } finally {
    image.dispose?.();
  }
}

export async function preparePickerImageUriForUpload(
  imageUri: string,
  fileName?: string | null,
  mimeType?: string | null,
): Promise<{ uri: string; dispose?: () => void }> {
  const image = await convertHeicIfNeeded({ uri: imageUri, fileName, mimeType });

  return {
    uri: image.uri,
    dispose: image.dispose,
  };
}

export async function uploadBlobToStorageBucket(
  bucket: string,
  storagePath: string,
  body: UploadBody,
  contentType?: string,
  options?: { upsert?: boolean },
): Promise<void> {
  assertNonEmptyUploadBody(body);
  const { error } = await Backend.storage.from(bucket).upload(storagePath, body, {
    contentType: contentType || (body instanceof Blob ? body.type : undefined) || JPEG_CONTENT_TYPE,
    upsert: options?.upsert ?? false,
  });
  throwRpcIfFailed({ data: null, error });
}

export async function uploadLocalPickerImage(
  bucket: string,
  userId: string,
  imageUri: string,
  fileNameHint?: string,
  mimeType?: string | null,
  maxWidth = 1200,
): Promise<string> {
  const name = fileNameHint ?? `photo-${Date.now()}.jpg`;
  const prepared = await preparePickerImageForUpload(imageUri, name, mimeType, maxWidth);
  const storageFileName = isHeicLikeFile(prepared.fileName ?? name, prepared.contentType)
    ? (jpegFileName(prepared.fileName ?? name) ?? `photo-${Date.now()}.jpg`)
    : (prepared.fileName ?? name);
  const storagePath = generateRexImageStoragePath(userId, storageFileName);
  await uploadBlobToStorageBucket(bucket, storagePath, prepared.body, prepared.contentType);
  return storagePath;
}
