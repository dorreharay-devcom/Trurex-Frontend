import * as ImageManipulator from 'expo-image-manipulator';
import { Backend } from '~/services/AuthService';
import { generateRexImageStoragePath } from './photoUtils';

export async function resizeForUpload(uri: string, maxWidth = 1200): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth } }],
    { compress: 0.82, format: ImageManipulator.SaveFormat.JPEG },
  );
  return result.uri;
}

export async function fetchUriAsBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri);
  return response.blob();
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
  if (error) throw error;
}

export async function uploadLocalPickerImage(
  bucket: string,
  userId: string,
  imageUri: string,
  fileNameHint?: string,
  maxWidth = 1200,
): Promise<string> {
  const name = fileNameHint ?? `photo-${Date.now()}.jpg`;
  const storagePath = generateRexImageStoragePath(userId, name);
  const resizedUri = await resizeForUpload(imageUri, maxWidth);
  const blob = await fetchUriAsBlob(resizedUri);
  await uploadBlobToStorageBucket(bucket, storagePath, blob);
  return storagePath;
}
