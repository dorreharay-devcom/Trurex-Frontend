import { Backend, unwrap } from '~/shared/api/client';
import { throwRpcIfFailed } from '~/utils/mutationRestrictionError';

export interface TagRow {
  id: string;
  label: string;
  slug: string;
  usage_count: number;
}

export interface TagFullRow {
  id: string;
  label: string;
  slug: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const TagsApi = {
  trendingNow: async (): Promise<TagRow[]> => {
    const result = unwrap(await Backend.rpc('tranding_now_tags'));
    return Array.isArray(result) ? (result as TagRow[]) : [];
  },

  search: async (searchTerm: string, limit = 20): Promise<TagRow[]> => {
    const result = unwrap(
      await Backend.rpc('search_tags', {
        search_term: searchTerm,
        result_limit: limit,
      }),
    );
    return Array.isArray(result) ? (result as TagRow[]) : [];
  },

  createTag: async (label: string): Promise<TagFullRow> => {
    const { data, error } = await Backend.rpc('create_tag', { input_label: label });
    throwRpcIfFailed({ data, error });
    return data as TagFullRow;
  },

  readAll: async (): Promise<TagFullRow[]> => {
    const { data, error } = await Backend.from('tags')
      .select('*')
      .order('label', { ascending: true });
    throwRpcIfFailed({ data, error });
    return (data ?? []) as TagFullRow[];
  },
};
