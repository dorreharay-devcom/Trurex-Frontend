import { describe, expect, it } from 'vitest';
import {
  hasBusinessProfileChanges,
  toUpdateBusinessProfileInput,
} from '~/features/business-account/lib/businessProfileForm';

describe('hasBusinessProfileChanges', () => {
  it('ignores whitespace-only description edits', () => {
    expect(
      hasBusinessProfileChanges({ initialDescription: 'Coffee', description: ' Coffee ' }),
    ).toBe(false);
    expect(hasBusinessProfileChanges({ initialDescription: null, description: '' })).toBe(false);
  });

  it('detects description edits', () => {
    expect(hasBusinessProfileChanges({ initialDescription: 'Coffee', description: 'Tea' })).toBe(
      true,
    );
  });
});

describe('toUpdateBusinessProfileInput', () => {
  it('returns nothing when nothing changed', () => {
    expect(
      toUpdateBusinessProfileInput({ initialDescription: 'Coffee', description: 'Coffee' }),
    ).toBeNull();
  });

  it('sends the trimmed description', () => {
    expect(
      toUpdateBusinessProfileInput({ initialDescription: 'Coffee', description: ' Tea ' }),
    ).toEqual({ p_description: 'Tea' });
  });
});
