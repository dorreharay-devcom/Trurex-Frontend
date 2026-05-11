import type { CircleApiRow } from '~/api/circlesApi';
import type { NetworkUserRow } from '~/types/network';
import { isWeb } from '~/utils';

export const CIRCLE_COLOR_PRESETS = [
  '#9333ea',
  '#ec4899',
  '#38bdf8',
  '#14b8a6',
  '#ea580c',
  '#ef4444',
  '#2563eb',
  '#ca8a04',
] as const;

export type CirclePresetColor = (typeof CIRCLE_COLOR_PRESETS)[number];

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
  const sk = circle.system_kind;
  if (sk == null || sk === '') return USER_CREATED_POLICY;
  const key = (SYSTEM_KIND_ALIASES[sk] ?? sk) as CanonicalSystemKind;
  const preset = POLICY_BY_SYSTEM_KIND[key];
  return preset ?? UNKNOWN_SYSTEM_POLICY;
}

export function getInviteOrigin(): string {
  if (isWeb && typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://trurex.com';
}

export function selectFollowersNotFollowedBack(
  followerRows: NetworkUserRow[],
  followingRows: NetworkUserRow[],
): NetworkUserRow[] {
  const iFollowUserIds = new Set(followingRows.map((r) => r.user_id));
  return followerRows.filter((r) => !iFollowUserIds.has(r.user_id));
}

export const DELETE_CIRCLE_CONFIRM_MESSAGE =
  'This removes the circle and its memberships. This cannot be undone.';
