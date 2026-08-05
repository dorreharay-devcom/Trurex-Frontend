import { describe, expect, it } from 'vitest';
import {
  circleIconKind,
  defaultCircleSubtitle,
  isUserCreatedCircle,
  mapApiCirclesToDisplayRows,
  parseCircleAccentHex,
  sortCirclesForRingStack,
} from '~/features/circles/lib/display';
import { CIRCLE_SYSTEM_KIND } from '~/shared/config/circles';
import type { CircleApiRow } from '~/features/circles/types/circle';

const row = (partial: Partial<CircleApiRow>): CircleApiRow => ({
  id: partial.id ?? 'c1',
  owner_id: 'u1',
  name: partial.name ?? 'Circle',
  description: partial.description ?? null,
  icon_url: partial.icon_url ?? null,
  system_kind: partial.system_kind ?? null,
  is_active: true,
  created_at: partial.created_at ?? '2020-01-01T00:00:00.000Z',
  updated_at: '2020-01-01T00:00:00.000Z',
  color: partial.color,
  sort_rank: partial.sort_rank,
});

describe('circle display', () => {
  it('parses accent and icon kinds', () => {
    expect(parseCircleAccentHex(row({ color: '#AABBCC' }))).toBe('#AABBCC');
    expect(parseCircleAccentHex(row({ color: null, icon_url: '#112233' }))).toBe('#112233');
    expect(parseCircleAccentHex(row({ color: 'red' }))).toBeNull();
    expect(circleIconKind(row({ system_kind: CIRCLE_SYSTEM_KIND.innerCircle }))).toBe('lock');
    expect(circleIconKind(row({ system_kind: CIRCLE_SYSTEM_KIND.trusted }))).toBe('heart');
    expect(circleIconKind(row({ system_kind: CIRCLE_SYSTEM_KIND.broaderNetwork }))).toBe('users');
    expect(circleIconKind(row({ system_kind: null }))).toBe('globe');
  });

  it('sorts rings and maps display rows', () => {
    const rows = [
      row({ id: 'b', system_kind: CIRCLE_SYSTEM_KIND.broaderNetwork, sort_rank: 3 }),
      row({ id: 'i', system_kind: CIRCLE_SYSTEM_KIND.innerCircle, sort_rank: 1 }),
      row({ id: 't', system_kind: CIRCLE_SYSTEM_KIND.trusted, sort_rank: 2 }),
      row({ id: 'u', system_kind: null, name: 'Custom', color: '#14b8a6', sort_rank: 4 }),
      row({
        id: 'orphan',
        system_kind: 'legacy_kind',
        name: 'Orphan',
        sort_rank: 9,
        created_at: '2021-01-01T00:00:00.000Z',
      }),
      row({
        id: 'i2',
        system_kind: CIRCLE_SYSTEM_KIND.innerCircle,
        sort_rank: 0,
        created_at: '2019-01-01T00:00:00.000Z',
      }),
    ];
    const ordered = sortCirclesForRingStack(rows).map((r) => r.id);
    expect(ordered[0]).toBe('i2');
    expect(ordered).toContain('orphan');
    expect(ordered.at(-1)).toBe('b');
    expect(isUserCreatedCircle(row({ system_kind: null }))).toBe(true);
    expect(defaultCircleSubtitle(row({ system_kind: null }))).toBe('Private circle');
    expect(defaultCircleSubtitle(row({ description: 'Desc' }))).toBe('Desc');

    const display = mapApiCirclesToDisplayRows(sortCirclesForRingStack(rows));
    expect(display[0]?.iconKind).toBe('lock');
    expect(display.find((d) => d.id === 'u')?.title).toBe('Custom');
    expect(display.find((d) => d.id === 'u')?.accent).toBe('#14b8a6');
  });
});
