import type { Href } from 'expo-router';

export const Routes = {
  Main: '/discover',
  Profile: '/profile',
  ProfileEdit: '/profile/edit',
  ProfileBlocked: '/profile/blocked',
  Gems: '/gems',
  Circles: '/circles',
  Create: '/create',
  Login: '/login',
  Signup: '/signup',
  ForgotPassword: '/forgot-password',
  ResetPassword: '/reset-password',
  Mfa: '/mfa',
  Terms: '/terms',
  CommunityGuidelines: '/community-guidelines',
  Privacy: '/privacy',
} as const satisfies Record<string, Href>;

export function toUserRoute(userId: string): Href {
  return `/user/${userId}`;
}

export function toRexRoute(
  rexId: string,
  options?: { scrollToCommentId?: string; scrollToComments?: boolean },
): Href {
  const params = new URLSearchParams();
  if (options?.scrollToCommentId) params.set('commentId', options.scrollToCommentId);
  else if (options?.scrollToComments) params.set('comments', '1');
  const qs = params.toString();
  return `/rex/${rexId}${qs ? `?${qs}` : ''}`;
}

export function toCreateRoute(options?: { editRexId?: string; step?: string }): Href {
  const params = new URLSearchParams();
  if (options?.editRexId) params.set('edit', options.editRexId);
  params.set('step', options?.step ?? 'search');
  return `/create?${params.toString()}`;
}

export function toCreateRexRequestRoute(options?: { editRequestId?: string }): Href {
  const params = new URLSearchParams();
  if (options?.editRequestId) params.set('edit', options.editRequestId);
  const qs = params.toString();
  return `/create-rex-request${qs ? `?${qs}` : ''}`;
}

export function toRexRequestRoute(requestId: string): Href {
  return `/rex-request/${requestId}`;
}

export function toCircleRoute(circleId: string): Href {
  return `/circles/${circleId}`;
}
