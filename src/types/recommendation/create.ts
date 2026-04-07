export const CREATE_REC_STEPS = ['search', 'category', 'scorecard', 'circles', 'confirm'] as const;

export type CreateRecStepId = (typeof CREATE_REC_STEPS)[number];

export type SearchEntryMode = 'select' | 'manual';

export type CreateRecSearchPlace = {
  id: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  categoryId: string;
};
