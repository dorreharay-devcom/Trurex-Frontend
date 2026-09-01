import React, { useCallback } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '~/features/auth/providers';
import { useCommentComposer } from '~/features/rex-detail/hooks/comments/useCommentComposer';
import { runCommentMutation } from '~/features/rex-detail/hooks/comments/useCommentActions';
import CommentComposer from '~/features/rex-detail/ui/comments/common/CommentComposer';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import { Theme } from '~/shared/theme/Theme';
import { useRexRequestComments } from '~/features/rex-requests/hooks/detail/useRexRequestComments';
import RexRequestCommentRow from '~/features/rex-requests/ui/detail/RexRequestCommentRow';

type Props = {
  requestId: string;
  onUserPress?: (userId: string) => void;
  onReportComment?: (commentId: string) => void;
};

function RexRequestCommentsSection({ requestId, onUserPress, onReportComment }: Props) {
  const { user } = useAuth();
  const { comments, loading, loadError, refetch, addComment, deleteComment } =
    useRexRequestComments(requestId);
  const composer = useCommentComposer({
    rexId: requestId,
    addComment: (body) => addComment(body),
    autoFocus: false,
  });

  const handleDelete = useCallback(
    async (commentId: string) => {
      await runCommentMutation('Delete failed', () => deleteComment(commentId));
    },
    [deleteComment],
  );

  return (
    <View className="gap-4 pt-4">
      {loading ? (
        <View className="items-center py-6">
          <ActivityIndicator color={Theme.colors.primary} />
        </View>
      ) : loadError ? (
        <QueryErrorState title="Couldn't load comments" onRetry={() => void refetch()} />
      ) : comments.length === 0 ? (
        <Text className="py-4 text-center text-sm text-muted-foreground">
          No comments yet. Be the first to ask a question!
        </Text>
      ) : (
        <View className="gap-4">
          {comments.map((c) => (
            <RexRequestCommentRow
              key={c.comment_id}
              comment={c}
              currentUserId={user?.id}
              onUserPress={onUserPress}
              onReport={onReportComment}
              onDelete={(commentId) => void handleDelete(commentId)}
            />
          ))}
        </View>
      )}

      {user ? <CommentComposer composer={composer} /> : null}
    </View>
  );
}

export default RexRequestCommentsSection;
