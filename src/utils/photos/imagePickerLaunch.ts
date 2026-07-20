import type { ImagePickerOptions } from 'expo-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export type PickedLibraryImage = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  dispose?: () => void;
};

export function buildLibraryImagePickerOptions(remainingSlots: number): ImagePickerOptions {
  const n = Math.max(1, remainingSlots);
  return {
    mediaTypes: 'images',
    allowsMultipleSelection: n > 1,
    selectionLimit: n,
    quality: 0.85,
    preferredAssetRepresentationMode:
      ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
  };
}

function imageMimeFromFile(file: File): string | null {
  if (file.type.trim().length > 0) return file.type;
  if (/\.(heic|heif)$/i.test(file.name)) return 'image/heic';
  if (/\.jpe?g$/i.test(file.name)) return 'image/jpeg';
  if (/\.png$/i.test(file.name)) return 'image/png';
  if (/\.webp$/i.test(file.name)) return 'image/webp';
  return null;
}

function pickWebLibraryImages(remainingSlots: number): Promise<PickedLibraryImage[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept =
      'image/*,.heic,.heif,image/heic,image/heif,image/heic-sequence,image/heif-sequence';
    input.multiple = remainingSlots > 1;
    input.style.display = 'none';

    const cleanup = () => {
      input.remove();
    };

    input.onchange = () => {
      const files = Array.from(input.files ?? []).slice(0, remainingSlots);
      const images = files.map((file) => {
        const uri = URL.createObjectURL(file);
        return {
          uri,
          fileName: file.name || `photo-${Date.now()}.jpg`,
          mimeType: imageMimeFromFile(file),
          dispose: () => URL.revokeObjectURL(uri),
        };
      });
      cleanup();
      resolve(images);
    };

    input.oncancel = () => {
      cleanup();
      resolve([]);
    };

    document.body.appendChild(input);
    input.click();
  });
}

export async function pickLibraryImages(remainingSlots: number): Promise<PickedLibraryImage[]> {
  const n = Math.max(1, remainingSlots);

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return pickWebLibraryImages(n);
  }

  const result = await ImagePicker.launchImageLibraryAsync(buildLibraryImagePickerOptions(n));
  if (result.canceled || !result.assets?.length) return [];

  return result.assets.slice(0, n).map((asset) => ({
    uri: asset.uri,
    fileName: asset.fileName,
    mimeType: asset.mimeType,
  }));
}
