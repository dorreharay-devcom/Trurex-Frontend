import dayjs from 'dayjs';

export function formatCompactRelativeTime(iso: string): string {
  const then = dayjs(iso);
  if (!then.isValid()) return '';

  const mins = Math.floor(dayjs().diff(then, 'minute'));
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;

  const days = Math.floor(hrs / 24);
  return `${days}d`;
}
