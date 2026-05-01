import { Backend } from '~/services/AuthService';

export type GooglePlacesSearchMeta = {
  localCount: number;
  googleSkippedNoKey: boolean;
  partial?: boolean;
};

export type GooglePlacesSearchResultItem = {
  source: 'database' | 'google';
  id?: string;
  provider?: string | null;
  providerPlaceId?: string | null;
  placeResourceName?: string;
  mainText: string;
  secondaryText?: string;
  fullText?: string;
  latitude?: number | null;
  longitude?: number | null;
  categoryId?: string | null;
  categoryCode?: string | null;
  categoryName?: string | null;
  categoryIcon?: string | null;
  categoryColor?: string | null;
};

export type GooglePlacesSearchResponse = {
  results: GooglePlacesSearchResultItem[];
  meta: GooglePlacesSearchMeta;
};

export type RexPlaceRow = {
  id: string;
  created_by?: string | null;
  provider?: string | null;
  provider_place_id?: string | null;
  name: string;
  normalized_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type SearchPlacesForRexParams = {
  input: string;
  localLimit?: number;
  googleLimit?: number;
  sessionToken?: string;
  languageCode?: string;
  regionCode?: string;
  includedRegionCodes?: string[];
};

export async function searchPlacesForRex(
  params: SearchPlacesForRexParams,
): Promise<GooglePlacesSearchResponse> {
  const { data, error } = await Backend.functions.invoke<GooglePlacesSearchResponse>(
    'google-places',
    {
      body: {
        action: 'search',
        input: params.input,
        localLimit: params.localLimit,
        googleLimit: params.googleLimit,
        sessionToken: params.sessionToken,
        languageCode: params.languageCode,
        regionCode: params.regionCode,
        includedRegionCodes: params.includedRegionCodes,
      },
    },
  );
  if (error) throw error;
  if (data == null) {
    return { results: [], meta: { localCount: 0, googleSkippedNoKey: false } };
  }
  return data;
}

export async function upsertGooglePlace(params: {
  p_provider_place_id: string;
  p_name: string;
  p_category_code?: string | null;
  p_normalized_address: string | null;
  p_latitude: number | null;
  p_longitude: number | null;
}): Promise<RexPlaceRow> {
  const { data, error } = await Backend.rpc('upsert_google_place', params);
  if (error) throw error;
  return data as RexPlaceRow;
}

export async function createManualPlace(params: {
  p_name: string;
  p_category_code?: string | null;
  p_normalized_address: string | null;
  p_latitude: number | null;
  p_longitude: number | null;
}): Promise<RexPlaceRow> {
  const { data, error } = await Backend.rpc('create_manual_place', params);
  if (error) throw error;
  return data as RexPlaceRow;
}
