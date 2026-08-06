import { describe, expect, it } from 'vitest';
import {
  connectionCountLabel,
  memberCountLabel,
  ordinalDegreeLabel,
  suggestionSubtitle,
} from '~/features/circles/lib/labels';
import { SUGGESTION_REASON } from '~/features/circles/config/peopleSuggestions';

describe('circles labels', () => {
  it('formats connection counts with overflow marker', () => {
    expect(connectionCountLabel(7, false)).toBe('7');
    expect(connectionCountLabel(50, true)).toBe('50+');
  });

  it('formats member counts', () => {
    expect(memberCountLabel(1)).toBe('1 member');
    expect(memberCountLabel(3)).toBe('3 members');
  });

  it('formats ordinal degrees', () => {
    expect(ordinalDegreeLabel(1)).toBe('1st');
    expect(ordinalDegreeLabel(2)).toBe('2nd');
    expect(ordinalDegreeLabel(3)).toBe('3rd');
    expect(ordinalDegreeLabel(4)).toBe('4th');
    expect(ordinalDegreeLabel(11)).toBe('11th');
    expect(ordinalDegreeLabel(21)).toBe('21st');
  });

  it('suggestion subtitle only for global fallback', () => {
    expect(
      suggestionSubtitle({
        primary_reason: SUGGESTION_REASON.fallbackGlobal,
      } as never),
    ).toBe('Suggested for you');
    expect(suggestionSubtitle({ primary_reason: 'other' } as never)).toBeUndefined();
  });
});
