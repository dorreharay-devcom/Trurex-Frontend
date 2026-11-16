import { describe, expect, it } from 'vitest';
import {
  businessPhotoStoragePath,
  hasBusinessProfileChanges,
  toUpdateBusinessProfileInput,
} from '~/features/business-account/lib/businessProfileForm';

describe('businessPhotoStoragePath', () => {
  it('stores the photo under the user folder', () => {
    expect(businessPhotoStoragePath('user-1', 1700)).toBe('user-1/business-1700.jpg');
  });
});

describe('hasBusinessProfileChanges', () => {
  it('ignores whitespace-only description edits', () => {
    expect(
      hasBusinessProfileChanges({
        initialDescription: 'Coffee',
        description: ' Coffee ',
        hasPendingPhoto: false,
      }),
    ).toBe(false);
    expect(
      hasBusinessProfileChanges({
        initialDescription: null,
        description: '',
        hasPendingPhoto: false,
      }),
    ).toBe(false);
  });

  it('detects description edits and a new photo', () => {
    expect(
      hasBusinessProfileChanges({
        initialDescription: 'Coffee',
        description: 'Tea',
        hasPendingPhoto: false,
      }),
    ).toBe(true);
    expect(
      hasBusinessProfileChanges({
        initialDescription: 'Coffee',
        description: 'Coffee',
        hasPendingPhoto: true,
      }),
    ).toBe(true);
  });
});

describe('toUpdateBusinessProfileInput', () => {
  it('returns nothing when nothing changed', () => {
    expect(
      toUpdateBusinessProfileInput({
        initialDescription: 'Coffee',
        description: 'Coffee',
        photoPath: null,
      }),
    ).toBeNull();
  });

  it('sends only the changed fields', () => {
    expect(
      toUpdateBusinessProfileInput({
        initialDescription: 'Coffee',
        description: ' Tea ',
        photoPath: null,
      }),
    ).toEqual({ p_description: 'Tea' });
    expect(
      toUpdateBusinessProfileInput({
        initialDescription: 'Coffee',
        description: 'Coffee',
        photoPath: 'user-1/business-1.jpg',
      }),
    ).toEqual({ p_photo_path: 'user-1/business-1.jpg' });
    expect(
      toUpdateBusinessProfileInput({
        initialDescription: null,
        description: 'Tea',
        photoPath: 'user-1/business-1.jpg',
      }),
    ).toEqual({ p_description: 'Tea', p_photo_path: 'user-1/business-1.jpg' });
  });
});
