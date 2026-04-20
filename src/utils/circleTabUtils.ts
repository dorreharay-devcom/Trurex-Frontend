import { Alert } from 'react-native';
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

const DELETE_CIRCLE_BODY = 'This removes the circle and its memberships. This cannot be undone.';

export function confirmDeleteCircle(onConfirm: () => void): void {
  if (isWeb) {
    if (
      typeof window !== 'undefined' &&
      window.confirm(`Delete circle?\n\n${DELETE_CIRCLE_BODY}`)
    ) {
      onConfirm();
    }
    return;
  }
  Alert.alert('Delete circle?', DELETE_CIRCLE_BODY, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: onConfirm },
  ]);
}
