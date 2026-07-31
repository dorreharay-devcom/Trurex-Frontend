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
