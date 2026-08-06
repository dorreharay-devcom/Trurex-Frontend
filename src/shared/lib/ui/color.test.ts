import { describe, expect, it } from 'vitest';
import { rgbaFromHexColor } from '~/shared/lib/ui/color';

describe('color', () => {
  it('builds rgba from hex with fallback gray', () => {
    expect(rgbaFromHexColor('#ff0000', 0.5)).toBe('rgba(255,0,0,0.5)');
    expect(rgbaFromHexColor('00ff00', 1)).toBe('rgba(0,255,0,1)');
    expect(rgbaFromHexColor('nope', 0.2)).toBe('rgba(115,115,115,0.2)');
  });
});
