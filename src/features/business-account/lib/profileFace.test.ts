import { describe, expect, it } from 'vitest';
import { ACCOUNT_KIND } from '~/features/business-account/config/accountKind';
import { resolveProfileFace } from '~/features/business-account/lib/profileFace';

describe('resolveProfileFace', () => {
  it('keeps regular accounts on their personal face with all content', () => {
    expect(resolveProfileFace({ kind: ACCOUNT_KIND.regular, businessRequested: true })).toEqual({
      businessFace: false,
      postedAsBusinessFilter: null,
    });
    expect(resolveProfileFace({ kind: null, businessRequested: true })).toEqual({
      businessFace: false,
      postedAsBusinessFilter: null,
    });
  });

  it('always shows business-only accounts as the business with all content', () => {
    expect(
      resolveProfileFace({ kind: ACCOUNT_KIND.businessOnly, businessRequested: false }),
    ).toEqual({ businessFace: true, postedAsBusinessFilter: null });
  });

  it('splits converted accounts into personal and business content', () => {
    expect(resolveProfileFace({ kind: ACCOUNT_KIND.converted, businessRequested: true })).toEqual({
      businessFace: true,
      postedAsBusinessFilter: true,
    });
    expect(resolveProfileFace({ kind: ACCOUNT_KIND.converted, businessRequested: false })).toEqual({
      businessFace: false,
      postedAsBusinessFilter: false,
    });
  });
});
