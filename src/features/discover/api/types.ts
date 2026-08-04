export type DiscoverQueryParams = {
  category_filter?: string | null;
  tag_filters?: string[] | null;
  result_limit?: number;
  result_offset?: number;
};

export type SearchRexesParams = {
  search_term?: string | null;
  category_filter?: string | null;
  value_for_money_filters?: number[] | null;
  quality_filter?: number | null;
  created_from?: string | null;
  created_to?: string | null;
  result_limit?: number;
  result_offset?: number;
};
