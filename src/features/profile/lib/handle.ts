import { isHexUuidString } from '~/shared/lib/data/guards';

export function normalizeHandleInput(value: string | null | undefined): string {
  return (value ?? '').trim().replace(/^@+/, '');
}

export function normalizeHandleForSave(value: string): string | null {
  const trimmed = normalizeHandleInput(value);
  if (!trimmed) return null;
  return trimmed.replace(/\s+/g, '').toLowerCase();
}

export function formatProfileHandle(handle: string | null | undefined): string | null {
  if (!handle) return null;
  if (handle.startsWith('@')) return handle;
  return `@${handle}`;
}

export type ProfileRouteTarget = {
  userId?: string;
  handle?: string;
};

export function parseProfileRouteSlug(slug: string | undefined): ProfileRouteTarget {
  if (!slug) return {};
  if (isHexUuidString(slug)) return { userId: slug };
  return { handle: normalizeHandleInput(slug) };
}
