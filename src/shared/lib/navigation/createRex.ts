import type { Href } from 'expo-router';
import type { AddYourOwnRecSource } from '~/features/rex-create/lib/addYourOwn';
import { setCreatePrefill } from '~/features/rex-create/lib/createPrefillHandoff';
import type { Recommendation, RecommendationOpenOptions } from '~/shared/types/recommendation';
import { toCreateRoute, toRexRoute } from '~/shared/config/routes';

export { toCreateRoute };

type Router = {
  push: (href: Href) => void;
};

export function openCreateRex(
  router: Router,
  options?: { editRexId?: string; prefill?: AddYourOwnRecSource },
): void {
  if (options?.prefill) setCreatePrefill(options.prefill);
  router.push(toCreateRoute({ editRexId: options?.editRexId }));
}

export function openRex(router: Router, rexId: string, options?: RecommendationOpenOptions): void {
  router.push(toRexRoute(rexId, options));
}

export function openRecommendation(
  router: Router,
  rec: Recommendation,
  options?: RecommendationOpenOptions,
): void {
  openRex(router, rec.id, options);
}
