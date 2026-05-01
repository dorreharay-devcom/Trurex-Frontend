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

export function canRenameCreateRecCircle(c: CreateRecCircle): boolean {
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
