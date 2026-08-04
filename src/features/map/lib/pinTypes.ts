import {
  API_PIN_TYPE,
  API_TO_MAP_PIN_TYPE,
  MAP_PIN_COLOR,
  MAP_PIN_GLYPH,
  MAP_PIN_TYPE,
} from '~/features/map/config/pins';
import type { MapMarkerItem } from '~/features/map/types/mapMarker';
import type { MapPinType, PinVisibility } from '~/features/map/types/mapPin';
import type { MapPinRow } from '~/features/map/types/mapPinRow';
import type { Recommendation } from '~/shared/types/recommendation';

export function isOwnRecommendation(
  rec: Pick<Recommendation, 'authorId'>,
  currentUserId: string | null | undefined,
): boolean {
  const uid = currentUserId?.trim() ?? '';
  const author = rec.authorId?.trim() ?? '';
  return uid.length > 0 && author.length > 0 && author === uid;
}

export function apiPinTypeToMapPinType(
  pinType: MapPinRow['pin_type'],
  row: Pick<MapPinRow, 'is_saved'>,
): MapPinType {
  if (pinType != null) return API_TO_MAP_PIN_TYPE[pinType];
  if (row.is_saved) return MAP_PIN_TYPE.saved;
  return MAP_PIN_TYPE.rex;
}

export function deriveMapPinType(
  rec: Recommendation,
  currentUserId: string | null | undefined,
): MapPinType {
  const own = isOwnRecommendation(rec, currentUserId);
  if (own && rec.isSaved) return MAP_PIN_TYPE.overlap;
  if (own) return MAP_PIN_TYPE.beenHere;
  if (rec.isSaved) return MAP_PIN_TYPE.saved;
  if (rec.authorRelationshipStatus === API_PIN_TYPE.trusted) return MAP_PIN_TYPE.network;
  return MAP_PIN_TYPE.rex;
}

export function mapPinTypeForRecommendation(
  rec: Recommendation,
  pinTypeByRecId: ReadonlyMap<string, MapPinType>,
  currentUserId: string | null | undefined,
): MapPinType {
  return pinTypeByRecId.get(rec.id) ?? deriveMapPinType(rec, currentUserId);
}

function pinTypeVisible(pinType: MapPinType, layers: PinVisibility): boolean {
  if (pinType === MAP_PIN_TYPE.overlap) return layers.network && layers.saved;
  if (pinType === MAP_PIN_TYPE.network) return layers.network;
  if (pinType === MAP_PIN_TYPE.rex) return layers.rex;
  if (pinType === MAP_PIN_TYPE.saved) return layers.saved;
  return layers.beenHere;
}

export function pinRowPassesLayerVisibility(row: MapPinRow, layers: PinVisibility): boolean {
  return pinTypeVisible(apiPinTypeToMapPinType(row.pin_type, row), layers);
}

export function filterRecommendationsByPinLayers(
  recs: Recommendation[],
  layers: PinVisibility,
  userId: string | null,
  pinTypeByRecId?: ReadonlyMap<string, MapPinType>,
): Recommendation[] {
  return recs.filter((r) =>
    pinTypeVisible(mapPinTypeForRecommendation(r, pinTypeByRecId ?? new Map(), userId), layers),
  );
}

export function mapPinRowToMapMarkerItem(row: MapPinRow): MapMarkerItem {
  const pinType = apiPinTypeToMapPinType(row.pin_type, row);
  return {
    id: row.rex_id,
    latitude: row.latitude,
    longitude: row.longitude,
    title: row.place_name || 'Place',
    subtitle: row.place_name,
    pinType,
    glyph: MAP_PIN_GLYPH[pinType],
    pinColor: MAP_PIN_COLOR[pinType],
  };
}

export function mapAuthorRecommendedLabel(user: {
  name?: string | null;
  handle?: string | null;
}): string | null {
  const name = user.name?.trim() ?? '';
  if (name) return `${name} recommended it`;
  const rawHandle = user.handle?.trim().replace(/^@/, '') ?? '';
  if (rawHandle) return `@${rawHandle} recommended it`;
  return null;
}
