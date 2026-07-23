import type { AppNotification } from '~/types/notification/appNotification';
import type { RecommendationOpenOptions } from '~/types/recommendation/recommendation';

const REX_NOTIFICATION_TYPES = new Set(['comment', 'comment_reply', 'reply', 'reaction']);

export function notificationRexDeepLink(
  n: AppNotification,
): { rexId: string; options: RecommendationOpenOptions } | null {
  const fromData =
    n.data && typeof n.data.recommendation_id === 'string' ? n.data.recommendation_id.trim() : '';
  const rexId = (n.rex_id?.trim() || fromData).trim();
  if (!rexId || !REX_NOTIFICATION_TYPES.has(n.type)) return null;

  const commentId = n.comment_id?.trim() || undefined;
  if (commentId) {
    return { rexId, options: { scrollToCommentId: commentId } };
  }
  if (n.type === 'comment' || n.type === 'comment_reply' || n.type === 'reply') {
    return { rexId, options: { scrollToComments: true } };
  }
  return { rexId, options: {} };
}
