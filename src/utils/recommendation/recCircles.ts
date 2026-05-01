import type { CircleApiRow } from '~/api/circlesApi';
import type { CreateRecCircle } from '~/constants/recommendation/createCircles';
import { rgbaFromHexColor } from '~/utils/color';
import { finiteNum } from '~/utils/guards';

const SYSTEM_KIND_COLOR_FALLBACK: Record<string, string> = {
  inner_circle: '#7C3AED',
  trusted: '#EC4899',
  close_friends: '#EC4899',
  broader_network: '#0EA5E9',
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

export function parseCircleAccentHex(row: CircleApiRow): string | null {
  const c = row.color?.trim();
  if (c && HEX_COLOR.test(c)) return c;
  const u = row.icon_url?.trim();
  if (u && HEX_COLOR.test(u)) return u;
  return null;
}

export function hexToSoftIconBackground(accentHex: string, alpha = 0.2): string {
  return rgbaFromHexColor(accentHex, alpha);
}

function colorsForCircleRow(
  row: CircleApiRow,
  userPaletteIndex: number,
): {
  colors: { accent: string; iconBg: string };
  nextUserPaletteIndex: number;
} {
  const fromApi = parseCircleAccentHex(row);
  if (fromApi) {
    return {
      colors: { accent: fromApi, iconBg: hexToSoftIconBackground(fromApi) },
      nextUserPaletteIndex: userPaletteIndex,
    };
  }
  const kind = row.system_kind;
  if (kind && kind in SYSTEM_KIND_COLOR_FALLBACK) {
    const accent = SYSTEM_KIND_COLOR_FALLBACK[kind]!;
    return {
      colors: { accent, iconBg: hexToSoftIconBackground(accent) },
      nextUserPaletteIndex: userPaletteIndex,
    };
  }
  return {
    colors: pickUserStyle(userPaletteIndex),
    nextUserPaletteIndex: userPaletteIndex + 1,
  };
}

export type CircleTabIconKind = 'lock' | 'heart' | 'users' | 'globe';

export function circleTabIconKind(row: CircleApiRow): CircleTabIconKind {
  const k = row.system_kind;
  if (k === 'inner_circle') return 'lock';
  if (k === 'trusted' || k === 'close_friends') return 'heart';
  if (k === 'broader_network') return 'users';
  return 'globe';
}

export function defaultCircleSubtitle(row: CircleApiRow): string {
  const d = row.description?.trim();
  if (d) return d;
  return row.system_kind == null ? 'Private circle' : '';
}

export type CircleTabRow = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  iconBg: string;
  iconKind: CircleTabIconKind;
};

const SYSTEM_KIND_ORDER: Record<string, number> = {
  inner_circle: 0,
  trusted: 1,
  close_friends: 1,
  broader_network: 2,
};

function sortCustomByRankThenCreated(a: CircleApiRow, b: CircleApiRow): number {
  const ar = a.sort_rank ?? 999;
  const br = b.sort_rank ?? 999;
  if (ar !== br) return ar - br;
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

function pickFirstBySortRank(rows: CircleApiRow[]): CircleApiRow | undefined {
  if (!rows.length) return undefined;
  return rows.slice().sort(sortCustomByRankThenCreated)[0];
}

export function sortCirclesForRingStack(rows: CircleApiRow[]): CircleApiRow[] {
  if (!rows.length) return [];

  const inner = pickFirstBySortRank(rows.filter((r) => r.system_kind === 'inner_circle'));
  const trusted = pickFirstBySortRank(
    rows.filter((r) => r.system_kind === 'trusted' || r.system_kind === 'close_friends'),
  );
  const broader = pickFirstBySortRank(rows.filter((r) => r.system_kind === 'broader_network'));
  const custom = rows.filter(isUserCreatedCircle).sort(sortCustomByRankThenCreated);

  const ordered: CircleApiRow[] = [];
  if (inner) ordered.push(inner);
  if (trusted) ordered.push(trusted);
  ordered.push(...custom);
  if (broader) ordered.push(broader);

  const seen = new Set(ordered.map((r) => r.id));
  const orphans = rows.filter((r) => !seen.has(r.id)).sort(sortCustomByRankThenCreated);
  if (orphans.length) {
    const insertAt = broader ? ordered.length - 1 : ordered.length;
    ordered.splice(insertAt, 0, ...orphans);
  }

  return ordered;
}

export function isUserCreatedCircle(row: CircleApiRow): boolean {
  const k = row.system_kind;
  return k == null || k === '';
}

export function sortCirclesForTabList(rows: CircleApiRow[]): CircleApiRow[] {
  const hasServerOrder = rows.some((r) => typeof r.sort_rank === 'number');

  const sortUserCircles = (a: CircleApiRow, b: CircleApiRow) => {
    if (hasServerOrder) {
      const ar = a.sort_rank ?? 999;
      const br = b.sort_rank ?? 999;
      if (ar !== br) return ar - br;
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  };

  const sortSystemCircles = (a: CircleApiRow, b: CircleApiRow) => {
    if (hasServerOrder) {
      const ar = a.sort_rank ?? 999;
      const br = b.sort_rank ?? 999;
      if (ar !== br) return ar - br;
      const am = a.member_count ?? 0;
      const bm = b.member_count ?? 0;
      if (am !== bm) return am - bm;
    }
    const ao = SYSTEM_KIND_ORDER[a.system_kind ?? ''] ?? 50;
    const bo = SYSTEM_KIND_ORDER[b.system_kind ?? ''] ?? 50;
    if (ao !== bo) return ao - bo;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  };

  const systemRows = rows.filter((r) => !isUserCreatedCircle(r)).sort(sortSystemCircles);
  const userRows = rows.filter((r) => isUserCreatedCircle(r)).sort(sortUserCircles);

  return [...systemRows, ...userRows];
}

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
      systemKind: row.system_kind ?? null,
      memberCount: finiteNum(row.member_count, 0),
    };
  });
}
