export const ALL_CATEGORIES = 'all';

export type Category = {
  id: string;
  code: string;
  label: string;
  emoji: string;
  color: string;
  serverId?: string;
};
