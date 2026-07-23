import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, ActivityIndicator, Platform, Keyboard } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useRexComments } from '~/hooks/recommendation/useRexComments';
import { useAuth } from '~/services/AuthContext';
import { Theme } from '~/theme/Theme';
import { toastError } from '~/utils/appToast';
import { didAccountFrozenMutationToast } from '~/utils/mutationRestrictionError';
import { unknownErrorMessage } from '~/utils';
import { CommentComposer } from './common/CommentComposer';
import { CommentThread } from './common/CommentThread';
import { totalRexCommentCount } from '~/utils/recommendation/rexCommentTree';

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

export const RexCommentsSection: React.FC<RexCommentsSectionProps> = ({
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
  const { comments, loading, addComment, deleteComment, toggleCommentLike } = useRexComments(rexId);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const postingRef = useRef(false);
  const inputRef = useRef<TextInput | null>(null);
  const commentRefs = useRef(new Map<string, View>());
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);
  const focusNotifiedRef = useRef<string | null>(null);

  const total = useMemo(() => totalRexCommentCount(comments), [comments]);

  useEffect(() => {
    onCommentTotalChange?.(total);
  }, [total, onCommentTotalChange]);

  useEffect(() => {
    if (!autoFocusComposer || !user || focusCommentId) return;
    const delay = Platform.OS === 'web' ? 780 : 600;
    const t = setTimeout(() => inputRef.current?.focus(), delay);
    return () => clearTimeout(t);
  }, [autoFocusComposer, user, rexId, focusCommentId]);

  useEffect(() => {
    focusNotifiedRef.current = null;
    setHighlightedCommentId(null);
  }, [rexId, focusCommentId]);

  useEffect(() => {
    if (!focusCommentId || loading || !onFocusCommentReady) return;
    if (focusNotifiedRef.current === focusCommentId) return;

    let cancelled = false;
    let clearHighlight: ReturnType<typeof setTimeout> | undefined;

    const tryFocus = () => {
      if (cancelled || focusNotifiedRef.current === focusCommentId) return false;
      const target = commentRefs.current.get(focusCommentId);
      if (!target) return false;
      focusNotifiedRef.current = focusCommentId;
      setHighlightedCommentId(focusCommentId);
      onFocusCommentReady(target);
      clearHighlight = setTimeout(() => setHighlightedCommentId(null), 2500);
      return true;
    };

    if (tryFocus()) {
      return () => {
        cancelled = true;
        if (clearHighlight) clearTimeout(clearHighlight);
      };
    }

    const retry = setTimeout(() => {
      tryFocus();
    }, 120);

    return () => {
      cancelled = true;
      clearTimeout(retry);
      if (clearHighlight) clearTimeout(clearHighlight);
    };
  }, [focusCommentId, loading, comments, onFocusCommentReady]);

  const registerCommentRef = useCallback((commentId: string, ref: View | null) => {
    if (ref) commentRefs.current.set(commentId, ref);
    else commentRefs.current.delete(commentId);
  }, []);

  const handlePost = useCallback(async () => {
    const body = text.trim();
    if (!body || postingRef.current) return;
    postingRef.current = true;
    setPosting(true);
    try {
      await addComment(body, replyTo);
      setText('');
      setReplyTo(null);
    } catch (e) {
      if (didAccountFrozenMutationToast(e)) return;
      toastError('Comment failed', unknownErrorMessage(e, 'Try again.'));
    } finally {
      postingRef.current = false;
      setPosting(false);
    }
  }, [addComment, replyTo, text]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteComment(id);
      } catch (e) {
        if (didAccountFrozenMutationToast(e)) return;
        toastError('Delete failed', unknownErrorMessage(e, 'Try again.'));
      }
    },
    [deleteComment],
  );

  const startReply = useCallback((id: string) => {
    setReplyTo(id);
    inputRef.current?.focus();
  }, []);

  const handleCancelReply = useCallback(() => {
    setText('');
    setReplyTo(null);
    if (Platform.OS === 'web') return;
    inputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  const handleToggleLike = useCallback(
    async (commentId: string, currentlyLiked: boolean) => {
      if (!user) return;
      try {
        await toggleCommentLike(commentId, currentlyLiked);
      } catch (e) {
        if (didAccountFrozenMutationToast(e)) return;
        toastError('Could not update like', unknownErrorMessage(e, 'Try again.'));
      }
    },
    [user, toggleCommentLike],
  );

  return (
    <View className="gap-4 pt-2">
      <View className="flex-row items-center gap-1.5">
        <MessageCircle size={14} color={Theme.colors.secondaryText} />
        <Text className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Comments & Questions ({total})
        </Text>
      </View>

      {loading ? (
        <View className="items-center py-6">
          <ActivityIndicator color={Theme.colors.primary} />
        </View>
      ) : comments.length === 0 ? (
        <Text className="py-4 text-center text-sm text-muted-foreground">
          No comments yet. Be the first to ask a question!
        </Text>
      ) : (
        <View className="gap-4">
          {comments.map((c) => (
            <CommentThread
              key={c.id}
              root={c}
              currentUserId={user?.id}
              onReply={startReply}
              onDelete={handleDelete}
              onUserPress={onUserPress}
              onToggleLike={handleToggleLike}
              onReport={onReportComment}
              highlightCommentId={highlightedCommentId}
              onRowRef={registerCommentRef}
            />
          ))}
        </View>
      )}

      {user ? (
        <CommentComposer
          composerAnchorRef={composerAnchorRef}
          inputRef={inputRef}
          text={text}
          onChangeText={setText}
          onSubmit={handlePost}
          submitting={posting}
          replyToId={replyTo}
          onCancelReply={handleCancelReply}
          onInputFocus={onComposerFocus}
        />
      ) : null}
    </View>
  );
};
