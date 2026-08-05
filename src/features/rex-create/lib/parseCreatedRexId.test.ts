import { describe, expect, it } from 'vitest';
import { parseCreatedRexId } from '~/features/rex-create/lib/parseCreatedRexId';

describe('parseCreatedRexId', () => {
  it('reads bare string ids', () => {
    expect(parseCreatedRexId('abc-123')).toBe('abc-123');
  });

  it('reads object shapes from RPC', () => {
    expect(parseCreatedRexId({ rex_id: 'r1' })).toBe('r1');
    expect(parseCreatedRexId({ id: 'r2' })).toBe('r2');
  });

  it('reads first array element', () => {
    expect(parseCreatedRexId([{ id: 'r3' }])).toBe('r3');
  });

  it('returns null when missing', () => {
    expect(parseCreatedRexId(null)).toBeNull();
    expect(parseCreatedRexId({})).toBeNull();
  });
});
