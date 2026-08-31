import type { Href } from 'expo-router';
import { toCreateRexRequestRoute, toRexRequestRoute } from '~/shared/config/routes';

type Router = {
  push: (href: Href) => void;
};

export function openCreateRexRequest(router: Router, options?: { editRequestId?: string }): void {
  router.push(toCreateRexRequestRoute(options));
}

export function openRexRequest(router: Router, requestId: string): void {
  router.push(toRexRequestRoute(requestId));
}
