import { describe, expect, it } from 'vitest';
import {
  businessClaimErrorMessage,
  businessProfileUpdateErrorMessage,
  isBusinessClaimAlreadyPending,
} from '~/features/business-account/lib/claimErrors';

describe('isBusinessClaimAlreadyPending', () => {
  it('detects the unique violation code', () => {
    expect(isBusinessClaimAlreadyPending({ code: '23505' })).toBe(true);
    expect(isBusinessClaimAlreadyPending({ code: '22023' })).toBe(false);
    expect(isBusinessClaimAlreadyPending(new Error('boom'))).toBe(false);
    expect(isBusinessClaimAlreadyPending(null)).toBe(false);
  });
});

describe('businessClaimErrorMessage', () => {
  it('maps known claim errors', () => {
    expect(businessClaimErrorMessage({ code: '23505' })).toBe(
      'You already have a business claim under review.',
    );
    expect(businessClaimErrorMessage({ code: '22023' })).toBe('Choose a business to claim.');
    expect(businessClaimErrorMessage({ code: '42501' })).toBe('Sign in to claim a business.');
    expect(businessClaimErrorMessage({ code: 'BIZ02' })).toBe(
      'This business has already been claimed.',
    );
  });

  it('falls back to the error message or a default', () => {
    expect(businessClaimErrorMessage(new Error('Network down'))).toBe('Network down');
    expect(businessClaimErrorMessage({ code: 'XX000' })).toBe(
      'Could not submit your claim. Please try again.',
    );
  });
});

describe('businessProfileUpdateErrorMessage', () => {
  it('explains the business-only restriction', () => {
    expect(businessProfileUpdateErrorMessage({ code: '42501' })).toBe(
      'Only business accounts can edit a business profile.',
    );
  });

  it('falls back to the error message or a default', () => {
    expect(businessProfileUpdateErrorMessage({ message: 'Too long' })).toBe('Too long');
    expect(businessProfileUpdateErrorMessage(undefined)).toBe(
      'Could not save your business profile. Please try again.',
    );
  });
});
