export type CircleIconKind = 'lock' | 'heart' | 'users' | 'globe';

export type CircleDisplayRow = {
  id: string;
  title: string;
  subtitle: string;
  iconKind: CircleIconKind;
  accent: string;
  iconBg: string;
  systemKind: string | null;
  memberCount: number;
};
