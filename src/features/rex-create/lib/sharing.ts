import type { CreateRexRpcParams } from '~/features/rex-create/types/categoryCreateConfig';
import { isStrictUuid } from '~/shared/lib/data/guards';

export const REX_VISIBILITY = {
  public: 'public',
  private: 'private',
  circles: 'circles',
} as const;

export type RexVisibility = (typeof REX_VISIBILITY)[keyof typeof REX_VISIBILITY];

export const PUBLIC_CIRCLE_KEY = 'public';

export function resolveCreateRexCircleIds(
  selectedCircleIds: Set<string>,
  publicCircleId?: string | null,
): CreateRexRpcParams['circle_ids'] {
  const ids = [...selectedCircleIds].filter(
    (id) => id !== PUBLIC_CIRCLE_KEY && id !== publicCircleId,
  );
  const uuids = ids.filter(isStrictUuid);
  return uuids.length > 0 ? uuids : null;
}

export function resolveCreateRexVisibility(
  selectedCircleIds: Set<string>,
  privateSelected: boolean,
  publicCircleId?: string | null,
): NonNullable<CreateRexRpcParams['p_visibility']> {
  if (privateSelected) return REX_VISIBILITY.private;
  if (
    selectedCircleIds.has(PUBLIC_CIRCLE_KEY) ||
    (publicCircleId != null && selectedCircleIds.has(publicCircleId))
  ) {
    return REX_VISIBILITY.public;
  }
  return REX_VISIBILITY.circles;
}

export function keepKnownCircleIds(
  selectedCircleIds: Set<string>,
  knownCircleIds: ReadonlySet<string>,
): Set<string> {
  return new Set(
    [...selectedCircleIds].filter((id) => id === PUBLIC_CIRCLE_KEY || knownCircleIds.has(id)),
  );
}

export function canPostCreateRexShare(
  privateSelected: boolean,
  selectedCircleIds: Set<string>,
  publicCircleId?: string | null,
): boolean {
  if (privateSelected) return true;
  const visibility = resolveCreateRexVisibility(selectedCircleIds, privateSelected, publicCircleId);
  if (visibility === REX_VISIBILITY.public) return true;
  const circleIds = resolveCreateRexCircleIds(selectedCircleIds, publicCircleId);
  return Array.isArray(circleIds) && circleIds.length > 0;
}

export function hasNonPublicMockCircleSelection(
  selectedCircleIds: Set<string>,
  publicCircleId?: string | null,
): boolean {
  return [...selectedCircleIds].some(
    (id) => id !== PUBLIC_CIRCLE_KEY && id !== publicCircleId && !isStrictUuid(id),
  );
}
