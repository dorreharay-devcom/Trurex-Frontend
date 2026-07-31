import type { CircleApiRow } from '~/shared/api/circlesApi';
import { isNonEmptyString } from '~/utils/guards';

export const DELETE_CIRCLE_CONFIRM_MESSAGE =
  'This removes the circle and its memberships. This cannot be undone.';

export function canEditOrDeleteUserCircle(
  circle: CircleApiRow,
  userId: string | undefined,
): boolean {
  return !!userId && circle.owner_id === userId && circle.system_kind === null;
}

export type CircleUiPolicy = {
  showConnectionsAddPanel: boolean;
  allowOwnerRemoveMemberRpc: boolean;
};

const USER_CREATED_POLICY: CircleUiPolicy = {
  showConnectionsAddPanel: true,
  allowOwnerRemoveMemberRpc: true,
};

const UNKNOWN_SYSTEM_POLICY: CircleUiPolicy = {
  showConnectionsAddPanel: false,
  allowOwnerRemoveMemberRpc: true,
};

const POLICY_BY_SYSTEM_KIND = {
  inner_circle: {
    showConnectionsAddPanel: true,
    allowOwnerRemoveMemberRpc: true,
  },
  trusted: {
    showConnectionsAddPanel: false,
    allowOwnerRemoveMemberRpc: false,
  },
  broader_network: {
    showConnectionsAddPanel: false,
    allowOwnerRemoveMemberRpc: false,
  },
} as const satisfies Record<string, CircleUiPolicy>;

type CanonicalSystemKind = keyof typeof POLICY_BY_SYSTEM_KIND;

const SYSTEM_KIND_ALIASES: Record<string, CanonicalSystemKind> = {
  close_friends: 'trusted',
};

export function getCircleUiPolicy(circle: CircleApiRow): CircleUiPolicy {
  const systemKind = circle.system_kind;
  if (!isNonEmptyString(systemKind)) return USER_CREATED_POLICY;
  const key = (SYSTEM_KIND_ALIASES[systemKind] ?? systemKind) as CanonicalSystemKind;
  return POLICY_BY_SYSTEM_KIND[key] ?? UNKNOWN_SYSTEM_POLICY;
}
