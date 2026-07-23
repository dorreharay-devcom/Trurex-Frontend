import type { Recommendation } from '~/types/recommendation/recommendation';

/** Minimal card used to open detail when we only have a rex id (detail fetch fills the rest). */
export function recommendationStubFromId(rexId: string): Recommendation {
  return {
    id: rexId,
    title: '',
    categoryId: 'all',
    category: '',
    timeAgo: '',
    likes: 0,
    comments: 0,
    saves: 0,
    isLiked: false,
    isSaved: false,
  };
}
