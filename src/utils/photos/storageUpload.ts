import { Backend } from '~/services/AuthService';
import { generateRexImageStoragePath } from './photoUtils';

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
): Promise<string> {
  const name = fileNameHint ?? `photo-${Date.now()}.jpg`;
  const storagePath = generateRexImageStoragePath(userId, name);
  const blob = await fetchUriAsBlob(imageUri);
  await uploadBlobToStorageBucket(bucket, storagePath, blob);
  return storagePath;
}
