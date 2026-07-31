import type { User } from '@supabase/supabase-js';
import type { CategoryTagOption } from '~/features/rex-create/types/categoryCreateConfig';
import {
  SEARCH_MODE,
  type CreateRecSearchPlace,
  type SearchEntryMode,
} from '~/features/rex-create/types/create';
import type { UserProfileRow } from '~/types/network';

export type ConfirmAuthorPreview = {
  name: string;
  handle: string;
  initials: string;
};

function initialsFromDisplayName(displayName: string, email: string | undefined): string {
  const parts = displayName.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
  }
  const compact = displayName.replace(/\s/g, '');
  if (compact.length >= 2) return compact.slice(0, 2).toUpperCase();
  if (compact.length === 1)
    return `${compact[0]!.toUpperCase()}${email?.[1]?.toUpperCase() ?? ''}`.slice(0, 2);
  return email?.[0]?.toUpperCase() ?? '?';
}

export function authorFromAuthUser(user: User | null | undefined): ConfirmAuthorPreview {
  if (!user) {
    return { name: 'You', handle: '', initials: '?' };
  }
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const displayName =
    (typeof meta?.display_name === 'string' && meta.display_name.trim()) ||
    user.email?.split('@')[0] ||
    'You';
  const handleRaw =
    (typeof meta?.handle === 'string' && meta.handle.trim().replace(/^@/, '')) ||
    user.email?.split('@')[0] ||
    '';
  const handle = handleRaw ? `@${handleRaw}` : '';
  return {
    name: displayName,
    handle,
    initials: initialsFromDisplayName(displayName, user.email),
  };
}

export function authorForConfirmPreview(
  user: User | null | undefined,
  profile: UserProfileRow | null | undefined,
): ConfirmAuthorPreview {
  if (!profile) return authorFromAuthUser(user);
  const fallback = authorFromAuthUser(user);
  const name = profile.display_name?.trim() || fallback.name;
  const raw = profile.handle?.replace(/^@/, '').trim();
  const handle = raw ? `@${raw}` : fallback.handle;
  return {
    name,
    handle,
    initials: initialsFromDisplayName(name, user?.email),
  };
}

export function averageCategoryRatings(
  scores: Record<string, number | null>,
  valueForMoney?: number | null,
): string | null {
  const filled = Object.values(scores).filter((n): n is number => n != null && n > 0);
  const nums = [...filled];
  if (valueForMoney != null && valueForMoney > 0) nums.push(valueForMoney);
  if (nums.length === 0) return null;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return (Math.round(avg * 10) / 10).toFixed(1);
}

export type ConfirmPreviewPlace = {
  title: string;
  addressLines: string[];
};

export function getConfirmPreviewPlace(
  searchMode: SearchEntryMode,
  selectedSearchPlace: CreateRecSearchPlace | null,
  manualName: string,
  manualAddress: string,
  _manualGeotag: { lat: number; lng: number } | null,
  onlineName = '',
  onlineWebsiteUrl = '',
): ConfirmPreviewPlace {
  if (searchMode === SEARCH_MODE.online) {
    const website = onlineWebsiteUrl.trim();
    return {
      title: onlineName.trim() || '—',
      addressLines: website ? [website] : ['No fixed address'],
    };
  }
  if (searchMode === SEARCH_MODE.manual) {
    const addr = manualAddress.trim();
    return {
      title: manualName.trim() || '—',
      addressLines: addr ? [addr] : [],
    };
  }
  if (!selectedSearchPlace) return { title: '—', addressLines: [] };
  const sub = selectedSearchPlace.subtitle.trim();
  return { title: selectedSearchPlace.title, addressLines: sub ? [sub] : [] };
}

export function getConfirmTagLabels(
  selectedSlugs: string[],
  tagOptions: CategoryTagOption[],
): string[] {
  const map = new Map(tagOptions.map((t) => [t.slug, t.label]));
  return selectedSlugs.map((s) => map.get(s) ?? s);
}

export function getConfirmCircleTitles(
  selectedCircleIds: Set<string>,
  lookup: readonly { id: string; title: string }[],
): string[] {
  const map = new Map(lookup.map((c) => [c.id, c.title]));
  return [...selectedCircleIds]
    .map((id) => map.get(id))
    .filter((t): t is string => Boolean(t?.trim()));
}

export function getConfirmSharingLabel(
  privateRex: boolean,
  selectedCircleIds: Set<string>,
  lookup: readonly { id: string; title: string }[],
): string {
  if (privateRex) return 'Only you';
  const titles = getConfirmCircleTitles(selectedCircleIds, lookup);
  if (titles.length > 0) return titles.join(', ');
  if (selectedCircleIds.size > 0) return 'Unavailable circle';
  return 'No one yet';
}
