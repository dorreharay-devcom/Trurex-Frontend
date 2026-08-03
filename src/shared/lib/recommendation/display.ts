import type { RecommendationAuthor } from '~/shared/types/recommendation';

export function authorDisplayName(user?: RecommendationAuthor | null): string {
  const name = user?.name?.trim() ?? '';
  return name || 'Member';
}

export function categoryDisplayLabel(category: string | null | undefined): string {
  const label = category?.trim() ?? '';
  return label || 'Uncategorized';
}

export function placeDisplayTitle(title: string | null | undefined): string {
  const t = title?.trim() ?? '';
  return t || 'Place';
}
