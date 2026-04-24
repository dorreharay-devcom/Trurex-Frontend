import type { ImagePickerOptions } from 'expo-image-picker';
import * as ImagePicker from 'expo-image-picker';

export function buildLibraryImagePickerOptions(remainingSlots: number): ImagePickerOptions {
  const n = Math.max(1, remainingSlots);
  return {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: n > 1,
    selectionLimit: n,
    quality: 0.85,
  };
}
