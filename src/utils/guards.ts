export const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value);
};

export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.length > 0;
};

export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
};

export const optStr = (value: unknown): string | null =>
  typeof value === 'string' ? value : null;

export const optStrUndef = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

export const stringifyOrNull = (value: unknown): string | null =>
  value == null ? null : String(value);

export const coerceId = (value: unknown): string => {
  if (value == null) return '';
  return typeof value === 'string' ? value : String(value);
};

export const coerceNonEmptyId = (value: unknown): string | null => {
  const id = coerceId(value);
  return id.length > 0 ? id : null;
};

export const finiteNum = (value: unknown, fallback = 0): number =>
  isFiniteNumber(value) ? value : fallback;

export function unknownAsArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data == null) return [];
  return [data as T];
}

const HEX_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isHexUuidString(value: string): boolean {
  return HEX_UUID_RE.test(value);
}

const STRICT_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isStrictUuid(value: string): boolean {
  return STRICT_UUID_RE.test(value);
}

function parseFiniteNumber(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (t.length === 0) return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function firstNonEmptyString(
  record: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const raw = record[key];
    if (raw == null) continue;
    const trimmed = String(raw).trim();
    if (trimmed.length > 0) return trimmed;
  }
  return null;
}

export function firstFiniteNumber(
  record: Record<string, unknown>,
  fallback: number,
  ...keys: string[]
): number {
  for (const key of keys) {
    const n = parseFiniteNumber(record[key]);
    if (n != null) return n;
  }
  return fallback;
}

export function optionalFiniteNumber(
  record: Record<string, unknown>,
  ...keys: string[]
): number | undefined {
  for (const key of keys) {
    const n = parseFiniteNumber(record[key]);
    if (n != null) return n;
  }
  return undefined;
}

export function firstPositiveFiniteNumber(
  record: Record<string, unknown>,
  ...keys: string[]
): number | undefined {
  for (const key of keys) {
    const n = parseFiniteNumber(record[key]);
    if (n != null && n > 0) return n;
  }
  return undefined;
}

export function firstFiniteNumberInInclusiveRange(
  record: Record<string, unknown>,
  min: number,
  max: number,
  ...keys: string[]
): number | null {
  for (const key of keys) {
    const n = parseFiniteNumber(record[key]);
    if (n != null && n >= min && n <= max) return n;
  }
  return null;
}

export function firstBoolean(record: Record<string, unknown>, ...keys: string[]): boolean {
  for (const key of keys) {
    const raw = record[key];
    if (typeof raw === 'boolean') return raw;
  }
  return false;
}
