import type { PlaceRef } from '~/shared/types/placeRef';

type PlaceRefRpcParams = { p_rex_id: string } | { p_place_id: string };

export function rexPlaceRef(rexId: string | null | undefined): PlaceRef | null {
  return rexId ? { kind: 'rex', id: rexId } : null;
}

export function placeIdRef(placeId: string | null | undefined): PlaceRef | null {
  return placeId ? { kind: 'place', id: placeId } : null;
}

export function placeRefRpcParams(ref: PlaceRef): PlaceRefRpcParams {
  return ref.kind === 'rex' ? { p_rex_id: ref.id } : { p_place_id: ref.id };
}
