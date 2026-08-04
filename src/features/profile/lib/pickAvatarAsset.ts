import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { isWeb } from '~/shared/lib/ui/platform';
import {
  pickLibraryImages,
  type PickedLibraryImage,
} from '~/shared/lib/media/photos/imagePickerLaunch';

async function ensureLibraryPermission(permissionMessage: string): Promise<boolean> {
  if (isWeb) return true;

  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (perm.granted) return true;

  Alert.alert('Permission required', permissionMessage);
  return false;
}

export async function pickAvatarAsset(
  permissionMessage = 'Allow photo access to change your avatar.',
): Promise<PickedLibraryImage | null> {
  if (!(await ensureLibraryPermission(permissionMessage))) return null;

  const assets = await pickLibraryImages(1);
  return assets[0] ?? null;
}
