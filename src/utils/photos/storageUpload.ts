import * as ImageManipulator from 'expo-image-manipulator';
import { Backend } from '~/services/AuthService';
import { generateRexImageStoragePath } from './photoUtils';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';
import { convertHeicIfNeeded } from './heicConversion';

export async function resizeForUpload(uri: string, maxWidth = 1200): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: maxWidth } }], {
    compress: 0.82,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  return result.uri;
}

export async function fetchUriAsBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return response.blob();
}

export async function preparePickerImageForUpload(
  imageUri: string,
  fileName?: string | null,
  maxWidth = 1200,
): Promise<{ blob: Blob; fileName?: string | null }> {
  const image = await convertHeicIfNeeded({ uri: imageUri, fileName });

  try {
    const resizedUri = await resizeForUpload(image.uri, maxWidth);
    const blob = await fetchUriAsBlob(resizedUri);

    return {
      blob,
      fileName: image.fileName ?? fileName,
    };
  } finally {
    image.dispose?.();
  }
}

export async function preparePickerImageUriForUpload(
  imageUri: string,
  fileName?: string | null,
): Promise<{ uri: string; dispose?: () => void }> {
  const image = await convertHeicIfNeeded({ uri: imageUri, fileName });

  return {
    uri: image.uri,
    dispose: image.dispose,
  };
}

export async function uploadBlobToStorageBucket(
  bucket: string,
  storagePath: string,
  blob: Blob,
  contentType?: string,
): Promise<void> {
  const { error } = await Backend.storage.from(bucket).upload(storagePath, blob, {
    contentType: contentType || blob.type || 'image/jpeg',
    upsert: false,
  });
  throwRpcIfFailed({ data: null, error });
}

export async function uploadLocalPickerImage(
  bucket: string,
  userId: string,
  imageUri: string,
  fileNameHint?: string,
  maxWidth = 1200,
): Promise<string> {
  const name = fileNameHint ?? `photo-${Date.now()}.jpg`;
  const prepared = await preparePickerImageForUpload(imageUri, name, maxWidth);
  const storagePath = generateRexImageStoragePath(userId, prepared.fileName ?? name);
  const blob = prepared.blob;
  await uploadBlobToStorageBucket(bucket, storagePath, blob);
  return storagePath;
}
