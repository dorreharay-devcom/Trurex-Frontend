import type { UpdateBusinessProfileInput } from '~/features/business-account/types/businessProfile';

type DescriptionInput = {
  initialDescription: string | null;
  description: string;
};

export function hasBusinessProfileChanges({
  initialDescription,
  description,
}: DescriptionInput): boolean {
  return description.trim() !== (initialDescription ?? '').trim();
}

export function toUpdateBusinessProfileInput(
  input: DescriptionInput,
): UpdateBusinessProfileInput | null {
  return hasBusinessProfileChanges(input) ? { p_description: input.description.trim() } : null;
}
