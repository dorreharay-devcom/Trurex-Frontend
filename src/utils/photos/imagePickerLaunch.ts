import { Platform } from 'react-native';
import type { ImagePickerOptions } from 'expo-image-picker';
import * as ImagePicker from 'expo-image-picker';

export function buildLibraryImagePickerOptions(remainingSlots: number): ImagePickerOptions {
  return {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: Platform.OS === 'web' ? false : remainingSlots > 1,
    selectionLimit: remainingSlots,
    quality: 0.85,
  };
}
