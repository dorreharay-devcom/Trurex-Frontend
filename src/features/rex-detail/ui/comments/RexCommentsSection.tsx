import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useRexComments } from '~/features/rex-detail/hooks/comments/useRexComments';
import { useCommentActions } from '~/features/rex-detail/hooks/comments/useCommentActions';
import { useCommentComposer } from '~/features/rex-detail/hooks/comments/useCommentComposer';
import { useCommentFocus } from '~/features/rex-detail/hooks/comments/useCommentFocus';
import { useAuth } from '~/features/auth/providers';
import { Theme } from '~/shared/theme/Theme';
import CommentComposer from './common/CommentComposer';
import CommentThread from './common/CommentThread';
import QueryErrorState from '~/shared/ui/query/QueryErrorState';
import { totalRexCommentCount } from '~/features/rex-detail/lib/rexCommentTree';
import type { RexComment } from '~/features/rex-detail/types/rexComment';
import {
  useMentionAutocomplete,
  type MentionAutocompleteState,
} from '~/features/mentions/hooks/useMentionAutocomplete';

export type RexCommentsSectionProps = {
  rexId: string;
  onCommentTotalChange?: (total: number) => void;
  composerAnchorRef?: React.RefObject<View | null>;
  autoFocusComposer?: boolean;
  focusCommentId?: string;
  onFocusCommentReady?: (target: View) => void;
  onUserPress?: (userId: string) => void;
  onReportComment?: (commentId: string) => void;
  onComposerFocus?: () => void;
};

type CommentsListProps = {
  loading: boolean;
  loadError: boolean;
  onRetry: () => void;
  comments: RexComment[];
} & Omit<React.ComponentProps<typeof CommentThread>, 'root'>;

function CommentsList({
  loading,
  loadError,
  onRetry,
  comments,
  ...threadProps
}: CommentsListProps) {
  if (loading) {
    return (
      <View className="items-center py-6">
        <ActivityIndicator color={Theme.colors.primary} />
      </View>
    );
  }
  if (loadError) {
    return <QueryErrorState title="Couldn't load comments" onRetry={onRetry} />;
  }
  if (comments.length === 0) {
    return (
      <Text className="py-4 text-center text-sm text-muted-foreground">
        No comments yet. Be the first to ask a question!
      </Text>
    );
  }
  return (
    <View className="gap-4">
      {comments.map((c) => (
        <CommentThread key={c.id} root={c} {...threadProps} />
      ))}
    </View>
  );
}

const RexCommentsSection: React.FC<RexCommentsSectionProps> = ({
  rexId,
  onCommentTotalChange,
  composerAnchorRef,
  autoFocusComposer,
  focusCommentId,
  onFocusCommentReady,
  onUserPress,
  onReportComment,
  onComposerFocus,
}) => {
  const { user } = useAuth();
  const { comments, loading, loadError, refetch, addComment, deleteComment, toggleCommentLike } =
    useRexComments(rexId);

  const mentionRef = useRef<MentionAutocompleteState | null>(null);
  const addCommentWithMentions = useCallback(
    async (body: string, parentCommentId?: string | null) => {
      const taggedMentions = mentionRef.current?.resolveTaggedMentions(body) ?? [];
      await addComment(body, parentCommentId, taggedMentions);
      mentionRef.current?.reset();
    },
    [addComment],
  );

  const composer = useCommentComposer({
    rexId,
    addComment: addCommentWithMentions,
    autoFocus: !!autoFocusComposer && !!user && !focusCommentId,
  });
  const mention = useMentionAutocomplete({ text: composer.text, setText: composer.setText });
  mentionRef.current = mention;

  const focus = useCommentFocus({ rexId, focusCommentId, loading, comments, onFocusCommentReady });
  const { handleDelete, handleToggleLike } = useCommentActions({
    canLike: !!user,
    deleteComment,
    toggleCommentLike,
  });

  const total = useMemo(() => totalRexCommentCount(comments), [comments]);

  useEffect(() => {
    onCommentTotalChange?.(total);
  }, [total, onCommentTotalChange]);

  return (
    <View className="gap-4 pt-2">
      <View className="flex-row items-center gap-1.5">
        <MessageCircle size={14} color={Theme.colors.secondaryText} />
        <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Comments & Questions ({total})
        </Text>
      </View>

      <CommentsList
        loading={loading}
        loadError={loadError}
        onRetry={() => void refetch()}
        comments={comments}
        currentUserId={user?.id}
        onReply={composer.startReply}
        onDelete={handleDelete}
        onUserPress={onUserPress}
        onToggleLike={handleToggleLike}
        onReport={onReportComment}
        highlightCommentId={focus.highlightedCommentId}
        onRowRef={focus.registerCommentRef}
      />

      {user ? (
        <CommentComposer
          composer={composer}
          composerAnchorRef={composerAnchorRef}
          onInputFocus={onComposerFocus}
          mention={mention}
        />
      ) : null}
    </View>
  );
};

export default RexCommentsSection;
