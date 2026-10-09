import { Backend } from '~/shared/api/client';
import { coerceStringList, unknownAsArray } from '~/shared/lib/data/guards';
import { throwRpcIfFailed } from '~/shared/lib/errors/restriction';
import type { PlaceRexRow } from '~/features/business/types/placeRex';

export async function fetchPlaceRexes(params: {
  rexId: string;
  networkOnly: boolean;
  limit: number;
  offset: number;
}): Promise<PlaceRexRow[]> {
  const { data, error } = await Backend.rpc('get_place_rexes', {
    p_rex_id: params.rexId,
    p_network_only: params.networkOnly,
    p_limit: params.limit,
    p_offset: params.offset,
  });
  throwRpcIfFailed({ data, error });

  return unknownAsArray<Record<string, unknown>>(data).map((row) => ({
    ...(row as unknown as PlaceRexRow),
    tag_slugs: coerceStringList(row.tag_slugs),
    photo_paths: coerceStringList(row.photo_paths),
  }));
}
