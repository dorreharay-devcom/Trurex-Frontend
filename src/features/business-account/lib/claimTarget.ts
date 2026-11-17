import type { PlaceSummaryRow } from '~/features/business/types/placeSummary';
import type {
  ClaimSubject,
  ClaimTarget,
  SubmitBusinessClaimParams,
} from '~/features/business-account/types/claim';

type PlaceIdentity = Pick<PlaceSummaryRow, 'place_id' | 'place_name'>;

function nonBlank(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function toPlaceClaimTarget(
  placeId: string | null | undefined,
  placeName: string | null | undefined,
): ClaimTarget | null {
  const id = nonBlank(placeId);
  const name = nonBlank(placeName);
  if (!id && !name) return null;
  return { placeId: id, placeName: name };
}

export function resolveClaimTarget(
  subject: ClaimSubject | null,
  summary: PlaceIdentity | null | undefined,
): ClaimTarget | null {
  if (!subject) return null;
  if (subject.kind === 'place') return subject.target;
  if (summary === undefined) return null;
  return toPlaceClaimTarget(summary?.place_id, nonBlank(summary?.place_name) ?? subject.title);
}

export function claimSubjectTitle(subject: ClaimSubject | null): string | null {
  if (!subject) return null;
  if (subject.kind === 'rex') return nonBlank(subject.title);
  return subject.target.placeName;
}

export function toSubmitClaimParams({
  placeId,
  placeName,
}: ClaimTarget): SubmitBusinessClaimParams {
  return {
    ...(placeId ? { p_place_id: placeId } : {}),
    ...(placeName ? { p_place_name: placeName } : {}),
  };
}
