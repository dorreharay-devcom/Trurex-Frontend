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
      return {
        body: image.blob,
        fileName: jpegFileName(image.fileName ?? fileName),
        contentType: JPEG_CONTENT_TYPE,
      };
    }

    const resized = await resizeForUpload(image.uri, maxWidth);

    if (isNative) {
      if (!resized.base64) throw new Error('Could not read image data.');
      return {
        body: base64ToArrayBuffer(resized.base64),
        fileName: jpegFileName(image.fileName ?? fileName),
        contentType: JPEG_CONTENT_TYPE,
      };
    }

    const blob = await fetchUriAsBlob(resized.uri);

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
): Promise<void> {
  const { error } = await Backend.storage.from(bucket).upload(storagePath, body, {
    contentType: contentType || (body instanceof Blob ? body.type : undefined) || JPEG_CONTENT_TYPE,
    upsert: false,
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
