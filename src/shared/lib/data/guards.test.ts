import { describe, expect, it } from 'vitest';
import {
  coerceId,
  coerceNonEmptyId,
  coerceStringList,
  finiteNum,
  firstBoolean,
  firstFiniteNumber,
  firstFiniteNumberInInclusiveRange,
  firstNonEmptyString,
  firstPositiveFiniteNumber,
  firstRecord,
  isFiniteNumber,
  isHexUuidString,
  isNonEmptyString,
  isPlainObject,
  isStrictUuid,
  omitUndefined,
  optionalFiniteNumber,
  optStr,
  optStrUndef,
  parseRelationshipStatus,
  unknownAsArray,
} from '~/shared/lib/data/guards';
import { RELATIONSHIP_STATUS } from '~/shared/config/relationshipStatus';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

describe('guards core coercion', () => {
  it('primitives and object/array helpers', () => {
    expect(isFiniteNumber(1)).toBe(true);
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isNonEmptyString('a')).toBe(true);
    expect(isNonEmptyString('')).toBe(false);
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(optStr(1)).toBeNull();
    expect(optStr('x')).toBe('x');
    expect(optStrUndef(1)).toBeUndefined();
    expect(optStrUndef('y')).toBe('y');
    expect(coerceId(null)).toBe('');
    expect(coerceId(12)).toBe('12');
    expect(coerceNonEmptyId('')).toBeNull();
    expect(coerceNonEmptyId('id')).toBe('id');
    expect(finiteNum('no', 3)).toBe(3);
    expect(finiteNum(2)).toBe(2);
    expect(unknownAsArray(null)).toEqual([]);
    expect(unknownAsArray([1])).toEqual([1]);
    expect(unknownAsArray('solo')).toEqual(['solo']);
  });

  it('uuid + relationship status', () => {
    expect(isHexUuidString(UUID)).toBe(true);
    expect(isStrictUuid(UUID)).toBe(true);
    expect(isStrictUuid('00000000-0000-0000-0000-000000000000')).toBe(false);
    expect(parseRelationshipStatus(RELATIONSHIP_STATUS.following)).toBe(
      RELATIONSHIP_STATUS.following,
    );
    expect(parseRelationshipStatus('nope')).toBeNull();
    expect(parseRelationshipStatus(1)).toBeNull();
  });

  it('record field scanners', () => {
    const row = {
      a: '  hi ',
      b: '',
      n: '3.5',
      zero: 0,
      bad: 'x',
      range: 4,
      flag: true,
      keep: 1,
      drop: undefined,
    };
    expect(firstNonEmptyString(row, 'b', 'a')).toBe('hi');
    expect(firstFiniteNumber(row, 9, 'bad', 'n')).toBe(3.5);
    expect(optionalFiniteNumber(row, 'bad')).toBeUndefined();
    expect(firstPositiveFiniteNumber(row, 'zero', 'n')).toBe(3.5);
    expect(firstFiniteNumberInInclusiveRange(row, 1, 5, 'range')).toBe(4);
    expect(firstFiniteNumberInInclusiveRange(row, 1, 5, 'zero')).toBeNull();
    expect(firstBoolean(row, 'missing', 'flag')).toBe(true);
    expect(firstBoolean(row, 'missing')).toBe(false);
    expect(omitUndefined(row)).toEqual({
      a: '  hi ',
      b: '',
      n: '3.5',
      zero: 0,
      bad: 'x',
      range: 4,
      flag: true,
      keep: 1,
    });
  });

  it('lists and first record', () => {
    expect(coerceStringList([' a ', '', 2])).toEqual(['a', '2']);
    expect(coerceStringList('["x","y"]')).toEqual(['x', 'y']);
    expect(coerceStringList('not-json')).toEqual([]);
    expect(firstRecord(null)).toBeNull();
    expect(firstRecord([])).toBeNull();
    expect(firstRecord([{ a: 1 }])).toEqual({ a: 1 });
    expect(firstRecord({ a: 1 })).toEqual({ a: 1 });
    expect(firstRecord([1])).toBeNull();
  });
});
