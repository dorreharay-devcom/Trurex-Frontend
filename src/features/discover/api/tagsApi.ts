import { Backend, unwrap } from '~/shared/api/client';

export type TagRow = {
  id: string;
  label: string;
  slug: string;
  usage_count: number;
};

export const TagsApi = {
  trendingNow: async (): Promise<TagRow[]> => {
    const result = unwrap(await Backend.rpc('tranding_now_tags'));
    return Array.isArray(result) ? (result as TagRow[]) : [];
  },
};
