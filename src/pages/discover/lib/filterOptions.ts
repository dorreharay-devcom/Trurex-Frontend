import { VALUE_FOR_MONEY_LABELS } from '~/utils/recommendation/recContentDisplay';
import { ALL_TIME_DAYS, type RecencyDayToken } from '~/pages/discover/lib/searchParams';

export const VALUE_LABELS = VALUE_FOR_MONEY_LABELS;

export const TIME_FILTER_OPTIONS: { label: string; days: RecencyDayToken }[] = [
  { label: 'Today', days: 1 },
  { label: 'This week', days: 7 },
  { label: 'This month', days: 30 },
  { label: 'All time', days: ALL_TIME_DAYS },
];
