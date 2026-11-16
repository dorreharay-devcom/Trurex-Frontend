import type { UpdateBusinessProfileInput } from '~/features/business-account/types/businessProfile';

type ChangeInput = {
  initialDescription: string | null;
  description: string;
};

type UpdateInput = ChangeInput & {
  photoPath: string | null;
};

function isDescriptionChanged({ initialDescription, description }: ChangeInput): boolean {
  return description.trim() !== (initialDescription ?? '').trim();
}

export function businessPhotoStoragePath(userId: string, timestamp: number): string {
  return `${userId}/business-${timestamp}.jpg`;
}

export function hasBusinessProfileChanges(
  input: ChangeInput & { hasPendingPhoto: boolean },
): boolean {
  return input.hasPendingPhoto || isDescriptionChanged(input);
}

export function toUpdateBusinessProfileInput(
  input: UpdateInput,
): UpdateBusinessProfileInput | null {
  const payload: UpdateBusinessProfileInput = {
    ...(isDescriptionChanged(input) ? { p_description: input.description.trim() } : {}),
    ...(input.photoPath ? { p_photo_path: input.photoPath } : {}),
  };
  return Object.keys(payload).length > 0 ? payload : null;
}
