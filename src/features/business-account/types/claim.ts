export type ClaimTarget = {
  placeId: string | null;
  placeName: string | null;
};

export type ClaimSubject =
  | { kind: 'place'; target: ClaimTarget }
  | { kind: 'rex'; rexId: string; title: string };

export type SubmitBusinessClaimParams = {
  p_place_id?: string;
  p_place_name?: string;
};
