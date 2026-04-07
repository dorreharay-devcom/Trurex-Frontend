/** Create-recommendation wizard step ids (order = flow order). */
export const CREATE_REC_STEPS = ['search', 'category', 'scorecard', 'circles', 'confirm'] as const;

export type CreateRecStepId = (typeof CREATE_REC_STEPS)[number];

/** How the user picks what they recommend on the search step */
export type SearchEntryMode = 'select' | 'manual';

/** One row in the create-flow search results list */
export type CreateRecSearchPlace = {
  id: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  /** Matches `REX_CATEGORIES` when chosen from search */
  categoryId: string;
};
