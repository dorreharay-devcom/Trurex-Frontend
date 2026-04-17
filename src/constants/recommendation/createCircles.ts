/** Lucide glyph inside the 48px tinted circle (Lovable: emoji or Globe). */
export type CreateRecCircleIconKind = 'globe' | 'lock' | 'heart' | 'users';

export type CreateRecCircle = {
  id: string;
  title: string;
  subtitle: string;
  iconKind: CreateRecCircleIconKind;
  /** Icon stroke/fill color */
  accent: string;
  /** Soft tint behind the icon, e.g. hsla(..., 0.15) */
  iconBg: string;
};

/** Matches Lovable Public row: hsl(145 60% 45%) on hsl(... / 0.15) */
export const PUBLIC_CIRCLE_ROW: CreateRecCircle = {
  id: 'public',
  title: 'Public',
  subtitle: 'Visible to anyone on TruRex',
  iconKind: 'globe',
  accent: 'hsl(145, 60%, 45%)',
  iconBg: 'hsla(145, 60%, 45%, 0.15)',
};
