import { isPlainObject, isStrictUuid } from '~/shared/lib/data/guards';

export function parseCreatedRexId(data: unknown): string | null {
  if (typeof data === 'string') {
    const id = data.trim();
    return isStrictUuid(id) || id.length > 0 ? id : null;
  }
  if (Array.isArray(data) && data.length > 0) {
    return parseCreatedRexId(data[0]);
  }
  if (!isPlainObject(data)) return null;

  for (const key of ['id', 'rex_id', 'p_rex_id', 'rexId'] as const) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) {
      const id = value.trim();
      return id;
    }
  }
  return null;
}
