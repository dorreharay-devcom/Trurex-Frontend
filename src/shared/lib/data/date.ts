import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = dayjs(iso);
  return date.isValid() ? date.fromNow() : '';
}

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
