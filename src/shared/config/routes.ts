import type { Href } from 'expo-router';

export const Routes = {
  Main: '/',
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

export function toMainTabRoute(tab: string): Href {
  return `/?tab=${tab}`;
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
