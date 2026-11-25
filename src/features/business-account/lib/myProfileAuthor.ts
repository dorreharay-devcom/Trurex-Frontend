import type { MyProfile } from '~/features/business-account/types/myProfile';
import { withHandlePrefix } from '~/shared/lib/recommendation/mapApiRow';
import type { RecommendationAuthor } from '~/shared/types/recommendation';

export function toRecommendationAuthor(profile: MyProfile): RecommendationAuthor {
  return {
    name: profile.displayName,
    handle: withHandlePrefix(profile.handle),
    avatar: profile.avatarUrl ?? '',
    verified: profile.verified,
  };
}
