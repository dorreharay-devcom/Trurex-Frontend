import { describe, expect, it } from 'vitest';
import { CONNECTION_PHASE, CONNECTION_TAB } from '~/features/circles/config/connections';
import { connectionListPhase } from '~/features/circles/lib/connectionPhase';
import type { NetworkUserRow } from '~/features/circles/types/networkUser';

const row = (id: string): NetworkUserRow => ({ user_id: id }) as NetworkUserRow;

const emptyFallback = {
  rows: [] as NetworkUserRow[],
  isInitialLoading: false,
  isError: false,
};

describe('connectionListPhase', () => {
  it('shows loading while initial fallback loads', () => {
    expect(
      connectionListPhase({
        tab: CONNECTION_TAB.trusted,
        searchActive: false,
        searchRows: [],
        searchFetching: false,
        searchError: false,
        fallback: { ...emptyFallback, isInitialLoading: true },
      }),
    ).toBe(CONNECTION_PHASE.loading);
  });

  it('maps empty tabs to dedicated empty phases', () => {
    expect(
      connectionListPhase({
        tab: CONNECTION_TAB.followers,
        searchActive: false,
        searchRows: [],
        searchFetching: false,
        searchError: false,
        fallback: emptyFallback,
      }),
    ).toBe(CONNECTION_PHASE.followersEmpty);
  });

  it('surfaces load error instead of fake empty', () => {
    expect(
      connectionListPhase({
        tab: CONNECTION_TAB.following,
        searchActive: false,
        searchRows: [],
        searchFetching: false,
        searchError: false,
        fallback: { ...emptyFallback, isError: true },
      }),
    ).toBe(CONNECTION_PHASE.error);
  });

  it('returns rows when fallback has people', () => {
    expect(
      connectionListPhase({
        tab: CONNECTION_TAB.trusted,
        searchActive: false,
        searchRows: [],
        searchFetching: false,
        searchError: false,
        fallback: { rows: [row('u1')], isInitialLoading: false, isError: false },
      }),
    ).toBe(CONNECTION_PHASE.rows);
  });

  it('search: loading / error / no match / rows', () => {
    const base = {
      tab: CONNECTION_TAB.trusted,
      searchActive: true,
      fallback: emptyFallback,
    };
    expect(
      connectionListPhase({
        ...base,
        searchRows: [],
        searchFetching: true,
        searchError: false,
      }),
    ).toBe(CONNECTION_PHASE.loading);
    expect(
      connectionListPhase({
        ...base,
        searchRows: [],
        searchFetching: false,
        searchError: true,
      }),
    ).toBe(CONNECTION_PHASE.error);
    expect(
      connectionListPhase({
        ...base,
        searchRows: [],
        searchFetching: false,
        searchError: false,
      }),
    ).toBe(CONNECTION_PHASE.noMatch);
    expect(
      connectionListPhase({
        ...base,
        searchRows: [row('u1')],
        searchFetching: false,
        searchError: false,
      }),
    ).toBe(CONNECTION_PHASE.rows);
  });
});
