import type { DiscoverCollectionRow } from '~/features/discover/api/types';
import type { UserCollection } from '~/features/collections/types/collection';

export function mapDiscoverCollectionToUserCollection(row: DiscoverCollectionRow): UserCollection {
  return {
    id: row.id,
    user_id: row.user_id,
    display_name: row.display_name,
    description: row.description,
    cover_image_path: row.cover_image_path,
    first_rex_photo_path: row.first_rex_photo_path,
    visibility: row.visibility,
    created_at: row.created_at,
    updated_at: row.created_at,
    rex_count: row.rex_count,
    total_count: row.total_count,
    is_my_collection: false,
    is_saved: row.is_saved,
  };
}
