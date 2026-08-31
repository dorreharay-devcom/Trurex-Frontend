export const NEED_BY_OPTIONS = [
  { id: 'asap', label: 'ASAP' },
  { id: 'this_week', label: 'This week' },
  { id: 'this_month', label: 'This month' },
  { id: 'no_rush', label: 'No rush' },
] as const;

export type NeedBy = (typeof NEED_BY_OPTIONS)[number]['id'];

const NEED_BY_LABEL_LOOKUP: Record<NeedBy, string> = Object.fromEntries(
  NEED_BY_OPTIONS.map((option) => [option.id, option.label]),
) as Record<NeedBy, string>;

export function needByLabel(needBy: NeedBy): string {
  return NEED_BY_LABEL_LOOKUP[needBy];
}
