import { ALL_TIME_DAYS, type RecencyDayToken } from '~/features/discover/lib/searchParams';

export const TIME_FILTER_OPTIONS: { label: string; days: RecencyDayToken }[] = [
  { label: 'Today', days: 1 },
  { label: 'This week', days: 7 },
  { label: 'This month', days: 30 },
  { label: 'All time', days: ALL_TIME_DAYS },
];
