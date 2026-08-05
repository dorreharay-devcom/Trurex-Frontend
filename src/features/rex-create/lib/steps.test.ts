import { describe, expect, it } from 'vitest';
import {
  canProceedForStep,
  getActiveCreateRecSteps,
  resolveStepIdAfterStepsChange,
  suggestedCategoryFromSearch,
  type CanProceedDeps,
} from '~/features/rex-create/lib/steps';
import { SEARCH_MODE, STEP_ID } from '~/features/rex-create/types/create';

const baseDeps = (): CanProceedDeps => ({
  searchMode: SEARCH_MODE.select,
  manualName: '',
  manualAddress: '',
  manualGeotag: null,
  onlineName: '',
  selectedSearchPlace: null,
  selectedCategoryId: null,
  selectedCircleIds: new Set(),
  privateRex: false,
  selectedSubcategoryCode: null,
});

describe('create steps', () => {
  it('includes subcategory step when needed', () => {
    expect(getActiveCreateRecSteps(null, true)).not.toContain(STEP_ID.type);
    expect(getActiveCreateRecSteps('food', true)).toContain(STEP_ID.type);
    expect(getActiveCreateRecSteps('food', false)).not.toContain(STEP_ID.type);
  });

  it('suggests category from search place', () => {
    expect(suggestedCategoryFromSearch(SEARCH_MODE.manual, null)).toBeNull();
    expect(
      suggestedCategoryFromSearch(SEARCH_MODE.select, {
        id: 'p',
        name: 'x',
        categoryCode: 'food_drink',
      } as never),
    ).toBe('food_drink');
    expect(
      suggestedCategoryFromSearch(SEARCH_MODE.select, {
        id: 'p',
        name: 'x',
        categoryId: 'local_code',
      } as never),
    ).toBe('local_code');
    expect(
      suggestedCategoryFromSearch(SEARCH_MODE.select, {
        id: 'p',
        name: 'x',
        categoryId: '550e8400-e29b-41d4-a716-446655440000',
      } as never),
    ).toBeNull();
  });

  it('guards proceed per step', () => {
    const d = baseDeps();
    expect(canProceedForStep(STEP_ID.search, d)).toBe(false);
    d.selectedSearchPlace = { id: 'p', name: 'Cafe' } as never;
    expect(canProceedForStep(STEP_ID.search, d)).toBe(true);
    d.searchMode = SEARCH_MODE.online;
    d.onlineName = 'shop';
    expect(canProceedForStep(STEP_ID.search, d)).toBe(true);
    d.searchMode = SEARCH_MODE.manual;
    d.manualName = 'n';
    d.manualAddress = 'a';
    d.manualGeotag = { lat: 1, lng: 2 };
    expect(canProceedForStep(STEP_ID.search, d)).toBe(true);
    d.selectedCategoryId = 'food';
    expect(canProceedForStep(STEP_ID.category, d)).toBe(true);
    expect(canProceedForStep(STEP_ID.type, d)).toBe(false);
    d.selectedSubcategoryCode = 'cafe';
    expect(canProceedForStep(STEP_ID.type, d)).toBe(true);
    expect(canProceedForStep(STEP_ID.scorecard, d)).toBe(true);
    expect(canProceedForStep(STEP_ID.photos, d)).toBe(true);
    expect(canProceedForStep(STEP_ID.circles, d)).toBe(false);
    d.privateRex = true;
    expect(canProceedForStep(STEP_ID.circles, d)).toBe(true);
    expect(canProceedForStep(STEP_ID.confirm, d)).toBe(true);
  });

  it('resolves step after active list changes', () => {
    const active = [STEP_ID.search, STEP_ID.category, STEP_ID.scorecard];
    expect(resolveStepIdAfterStepsChange(STEP_ID.category, active)).toBe(STEP_ID.category);
    expect(resolveStepIdAfterStepsChange(STEP_ID.type, active)).toBe(STEP_ID.scorecard);
    expect(resolveStepIdAfterStepsChange(STEP_ID.confirm, [])).toBe(STEP_ID.search);
  });
});
