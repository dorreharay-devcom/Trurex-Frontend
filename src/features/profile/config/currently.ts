export const CURRENTLY_FIELDS = [
  { key: 'binging', emoji: '🎬', label: 'Binging', viewLabel: 'Currently Binging' },
  { key: 'listening', emoji: '🎵', label: 'Listening to', viewLabel: 'Currently Listening to' },
  { key: 'reading', emoji: '📖', label: 'Reading', viewLabel: 'Currently Reading' },
] as const;

export type CurrentlyFieldKey = (typeof CURRENTLY_FIELDS)[number]['key'];
