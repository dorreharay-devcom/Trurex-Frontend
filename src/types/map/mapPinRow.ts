export type MapPinRow = {
  rex_id: string;
  place_id: string;
  place_name: string;
  place_rex_author_count: number;
  latitude: number;
  longitude: number;
  category_code: string;
  category_name: string;
  category_icon: string | null;
  category_color: string | null;
  is_saved: boolean;
  pin_type: 'trusted' | 'saved' | 'been_there' | 'overlap' | null;
};
