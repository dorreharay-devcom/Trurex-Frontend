import type { CircleApiRow } from '~/api/circlesApi';
import type { CreateRecCircle } from '~/constants/recommendation/createCircles';

/** Matches Lovable-style system circles: lock / heart / users on tinted squares. */
const SYSTEM_KIND_STYLE: Record<string, { accent: string; iconBg: string }> = {
  inner_circle: { accent: '#7c3aed', iconBg: '#ede9fe' },
  close_friends: { accent: '#db2777', iconBg: '#fce7f3' },
  broader_network: { accent: '#2563eb', iconBg: '#dbeafe' },
};

const USER_CIRCLE_PALETTE: { accent: string; iconBg: string }[] = [
  { accent: '#9333ea', iconBg: '#f3e8ff' },
  { accent: '#ca8a04', iconBg: '#fef9c3' },
  { accent: '#dc2626', iconBg: '#fee2e2' },
  { accent: '#0d9488', iconBg: '#ccfbf1' },
  { accent: '#ea580c', iconBg: '#ffedd5' },
];

function pickUserStyle(index: number) {
  return USER_CIRCLE_PALETTE[index % USER_CIRCLE_PALETTE.length];
}

const HEX_COLOR = /^#([0-9A-Fa-f]{6})$/;

/** Reads persisted swatch from `color` or a hex stored in `icon_url`. */
export function parseCircleAccentHex(row: CircleApiRow): string | null {
  const c = row.color?.trim();
  if (c && HEX_COLOR.test(c)) return c;
  const u = row.icon_url?.trim();
  if (u && HEX_COLOR.test(u)) return u;
  return null;
}

/** Soft tint behind the glyph (matches chosen swatch). */
export function hexToSoftIconBackground(accentHex: string, alpha = 0.2): string {
  const hex = accentHex.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function colorsForCircleRow(
  row: CircleApiRow,
  userPaletteIndex: number,
): {
  colors: { accent: string; iconBg: string };
  nextUserPaletteIndex: number;
} {
  const kind = row.system_kind;
  if (kind && kind in SYSTEM_KIND_STYLE) {
    return { colors: SYSTEM_KIND_STYLE[kind], nextUserPaletteIndex: userPaletteIndex };
  }
  const customHex = parseCircleAccentHex(row);
  if (customHex) {
    return {
      colors: {
        accent: customHex,
        iconBg: hexToSoftIconBackground(customHex),
      },
      nextUserPaletteIndex: userPaletteIndex,
    };
  }
  return {
    colors: pickUserStyle(userPaletteIndex),
    nextUserPaletteIndex: userPaletteIndex + 1,
  };
}

/** Lucide icon key for Circles tab + detail header (not used by create-flow CircleRow). */
export type CircleTabIconKind = 'lock' | 'heart' | 'users' | 'globe';

export function circleTabIconKind(row: CircleApiRow): CircleTabIconKind {
  const k = row.system_kind;
  if (k === 'inner_circle') return 'lock';
  if (k === 'close_friends') return 'heart';
  if (k === 'broader_network') return 'users';
  return 'globe';
}

export function defaultCircleSubtitle(row: CircleApiRow): string {
  const d = row.description?.trim();
  if (d) return d;
  const kind = row.system_kind;
  if (kind === 'inner_circle') return 'Your closest, most trusted people';
  if (kind === 'close_friends') return 'People you trust and know well';
  if (kind === 'broader_network') return 'Your wider trusted network';
  return 'Private circle';
}

export type CircleTabRow = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  iconBg: string;
  iconKind: CircleTabIconKind;
};

export function mapApiCirclesToTabRows(rows: CircleApiRow[]): CircleTabRow[] {
  let userPaletteIndex = 0;
  return rows.map((row) => {
    const { colors, nextUserPaletteIndex } = colorsForCircleRow(row, userPaletteIndex);
    userPaletteIndex = nextUserPaletteIndex;

    return {
      id: row.id,
      title: row.name,
      subtitle: defaultCircleSubtitle(row),
      accent: colors.accent,
      iconBg: colors.iconBg,
      iconKind: circleTabIconKind(row),
    };
  });
}

export function mapApiCirclesToDisplayRows(rows: CircleApiRow[]): CreateRecCircle[] {
  let userPaletteIndex = 0;
  return rows.map((row) => {
    const { colors, nextUserPaletteIndex } = colorsForCircleRow(row, userPaletteIndex);
    userPaletteIndex = nextUserPaletteIndex;

    return {
      id: row.id,
      title: row.name,
      subtitle: defaultCircleSubtitle(row),
      iconKind: circleTabIconKind(row),
      accent: colors.accent,
      iconBg: colors.iconBg,
    };
  });
}
