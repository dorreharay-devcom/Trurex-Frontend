import { isNonEmptyString } from '~/utils/guards';

export type CreateRecCircleIconKind = 'globe' | 'lock' | 'heart' | 'users';

export type CreateRecCircle = {
  id: string;
  title: string;
  subtitle: string;
  iconKind: CreateRecCircleIconKind;
  accent: string;
  iconBg: string;
  systemKind: string | null;
  memberCount: number;
};

export const PUBLIC_CIRCLE_ROW: CreateRecCircle = {
  id: 'public',
  title: 'Public',
  subtitle: 'Visible to anyone on TruRex',
  iconKind: 'globe',
  accent: '#22c55e',
  iconBg: 'rgba(34, 197, 94, 0.15)',
  systemKind: 'public',
  memberCount: 0,
};

export function canRenameCreateRecCircle(c: CreateRecCircle): boolean {
  if (c.id === 'public') return false;
  return c.systemKind == null || c.systemKind === '';
}

export function findRenameableCircleById(
  rows: CreateRecCircle[],
  id: string | null,
): CreateRecCircle | undefined {
  if (id == null || !isNonEmptyString(id)) return undefined;
  const row = rows.find((c) => c.id === id);
  if (row == null || !canRenameCreateRecCircle(row)) return undefined;
  return row;
}
