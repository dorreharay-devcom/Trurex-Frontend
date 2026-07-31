import type { CircleApiRow } from '~/shared/api/circlesApi';
import {
  CIRCLE_SYSTEM_KIND,
  SYSTEM_KIND_COLOR_FALLBACK,
  USER_CIRCLE_PALETTE,
} from '~/shared/config/circles';
import type { CircleDisplayRow, CircleIconKind } from '~/shared/types/circles';
import { rgbaFromHexColor } from '~/utils/color';
import { finiteNum, isNonEmptyString } from '~/utils/guards';

const HEX_COLOR = /^#([0-9A-Fa-f]{6})$/;
const SOFT_ICON_BG_ALPHA = 0.2;
const MISSING_SORT_RANK = 999;

type CircleColors = { accent: string; iconBg: string };

export function parseCircleAccentHex(row: CircleApiRow): string | null {
  const color = row.color?.trim();
  if (color && HEX_COLOR.test(color)) return color;
  const iconUrl = row.icon_url?.trim();
  if (iconUrl && HEX_COLOR.test(iconUrl)) return iconUrl;
  return null;
}

export function hexToSoftIconBackground(accentHex: string): string {
  return rgbaFromHexColor(accentHex, SOFT_ICON_BG_ALPHA);
}

export function circleIconKind(row: CircleApiRow): CircleIconKind {
  const kind = row.system_kind;
  if (kind === CIRCLE_SYSTEM_KIND.innerCircle) return 'lock';
  if (kind === CIRCLE_SYSTEM_KIND.trusted || kind === CIRCLE_SYSTEM_KIND.closeFriends) {
    return 'heart';
  }
  if (kind === CIRCLE_SYSTEM_KIND.broaderNetwork) return 'users';
  return 'globe';
}

export function defaultCircleSubtitle(row: CircleApiRow): string {
  const description = row.description?.trim();
  if (description) return description;
  return row.system_kind == null ? 'Private circle' : '';
}

export function isUserCreatedCircle(row: CircleApiRow): boolean {
  return !isNonEmptyString(row.system_kind);
}

function systemKindFallbackAccent(row: CircleApiRow): string | undefined {
  if (!row.system_kind) return undefined;
  return SYSTEM_KIND_COLOR_FALLBACK[row.system_kind];
}

function apiCircleColors(row: CircleApiRow): CircleColors | undefined {
  const accent = parseCircleAccentHex(row) ?? systemKindFallbackAccent(row);
  if (!accent) return undefined;
  return { accent, iconBg: hexToSoftIconBackground(accent) };
}

function userPaletteCycle(): () => CircleColors {
  let index = 0;
  return () => USER_CIRCLE_PALETTE[index++ % USER_CIRCLE_PALETTE.length];
}

function sortByRankThenCreated(a: CircleApiRow, b: CircleApiRow): number {
  const rankA = a.sort_rank ?? MISSING_SORT_RANK;
  const rankB = b.sort_rank ?? MISSING_SORT_RANK;
  if (rankA !== rankB) return rankA - rankB;
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

function firstBySortRank(rows: CircleApiRow[]): CircleApiRow | undefined {
  return rows.slice().sort(sortByRankThenCreated)[0];
}

function isTrustedKind(row: CircleApiRow): boolean {
  return (
    row.system_kind === CIRCLE_SYSTEM_KIND.trusted ||
    row.system_kind === CIRCLE_SYSTEM_KIND.closeFriends
  );
}

export function sortCirclesForRingStack(rows: CircleApiRow[]): CircleApiRow[] {
  if (!rows.length) return [];

  const inner = firstBySortRank(
    rows.filter((row) => row.system_kind === CIRCLE_SYSTEM_KIND.innerCircle),
  );
  const trusted = firstBySortRank(rows.filter(isTrustedKind));
  const broader = firstBySortRank(
    rows.filter((row) => row.system_kind === CIRCLE_SYSTEM_KIND.broaderNetwork),
  );
  const custom = rows.filter(isUserCreatedCircle).sort(sortByRankThenCreated);

  const ordered: CircleApiRow[] = [];
  if (inner) ordered.push(inner);
  if (trusted) ordered.push(trusted);
  ordered.push(...custom);
  if (broader) ordered.push(broader);

  const seen = new Set(ordered.map((row) => row.id));
  const orphans = rows.filter((row) => !seen.has(row.id)).sort(sortByRankThenCreated);
  if (orphans.length) {
    const insertAt = broader ? ordered.length - 1 : ordered.length;
    ordered.splice(insertAt, 0, ...orphans);
  }

  return ordered;
}

export function mapApiCirclesToDisplayRows(rows: CircleApiRow[]): CircleDisplayRow[] {
  const nextPaletteColors = userPaletteCycle();
  return rows.map((row) => {
    const colors = apiCircleColors(row) ?? nextPaletteColors();
    return {
      id: row.id,
      title: row.name,
      subtitle: defaultCircleSubtitle(row),
      iconKind: circleIconKind(row),
      accent: colors.accent,
      iconBg: colors.iconBg,
      systemKind: row.system_kind ?? null,
      memberCount: finiteNum(row.member_count, 0),
    };
  });
}
