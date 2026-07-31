import { useCallback, useEffect, useRef, useState } from 'react';
import type { View } from 'react-native';
import type { RexComment } from '~/features/rex-detail/types/rexComment';

const FOCUS_RETRY_MS = 120;
const HIGHLIGHT_DURATION_MS = 2500;

type Params = {
  rexId: string;
  focusCommentId?: string;
  loading: boolean;
  comments: RexComment[];
  onFocusCommentReady?: (target: View) => void;
};

export function useCommentFocus({
  rexId,
  focusCommentId,
  loading,
  comments,
  onFocusCommentReady,
}: Params) {
  const commentRefs = useRef(new Map<string, View>());
  const focusNotifiedRef = useRef<string | null>(null);
  const [highlightedCommentId, setHighlightedCommentId] = useState<string | null>(null);

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
      clearHighlight = setTimeout(() => setHighlightedCommentId(null), HIGHLIGHT_DURATION_MS);
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
    }, FOCUS_RETRY_MS);

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

  return { highlightedCommentId, registerCommentRef };
}
