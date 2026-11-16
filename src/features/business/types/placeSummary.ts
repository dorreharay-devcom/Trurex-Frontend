export type PlaceCategoryChip = {
  code: string;
  name: string;
  icon: string;
};

export type PlaceTopTag = {
  slug: string;
  label: string;
  count: number;
};

export type PlaceScorecardEntry = {
  label: string;
  avg_score: number;
  scored_count: number;
};

export type PlaceSummaryRow = {
  place_id: string | null;
  place_name: string | null;
  normalized_address: string | null;
  categories: PlaceCategoryChip[];
  total_rex_count: number;
  scored_rex_count: number;
  is_visible_business_page: boolean;
  global_score: number | null;
  scorecard: Record<string, PlaceScorecardEntry>;
  network_rex_count: number;
  network_score: number | null;
  top_tags: PlaceTopTag[];
  is_verified_business?: boolean | null;
  business_owner_id?: string | null;
  business_name?: string | null;
  business_description?: string | null;
  business_photo_path?: string | null;
  my_claim_status?: string | null;
};
