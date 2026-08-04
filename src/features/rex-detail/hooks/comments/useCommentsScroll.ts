import { useCallback, useEffect, useRef } from 'react';
import { findNodeHandle, type ScrollView, type View } from 'react-native';
import { isIos, isWeb } from '~/shared/lib/ui/platform';

const NATIVE_SCROLL_TOP_PAD = isIos ? 160 : 96;
const FOCUS_COMMENT_DELAYS_MS = isWeb ? [80] : [60, 280];
const COMPOSER_REFOCUS_DELAYS_MS = [80, 340];
const AUTO_SCROLL_TO_COMPOSER_DELAY_MS = isWeb ? 420 : 380;

function runAfterDelays(delaysMs: readonly number[], run: () => void) {
  delaysMs.forEach((delayMs) => setTimeout(run, delayMs));
}

function runAfterLayoutSettles(run: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(run);
  });
}

type WebScrollable = {
  scrollIntoView?: (options: { behavior?: string; block?: string; inline?: string }) => void;
};

type UseCommentsScrollArgs = {
  visible: boolean;
  recommendationId: string | undefined;
  scrollToComments: boolean | undefined;
  scrollToCommentId: string | undefined;
};

export function useCommentsScroll({
  visible,
  recommendationId,
  scrollToComments,
  scrollToCommentId,
}: UseCommentsScrollArgs) {
  const scrollRef = useRef<ScrollView>(null);
  const commentsSectionWrapRef = useRef<View>(null);
  const composerAnchorRef = useRef<View>(null);

  const scrollTargetIntoView = useCallback((targetEl: View) => {
    try {
      if (isWeb) {
        (targetEl as unknown as WebScrollable).scrollIntoView?.({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
        return;
      }

      const scrollNode = findNodeHandle(scrollRef.current);
      if (!scrollNode) return;
      targetEl.measureLayout(
        scrollNode,
        (_x, y) => {
          scrollRef.current?.scrollTo({
            y: Math.max(0, y - NATIVE_SCROLL_TOP_PAD),
            animated: true,
          });
        },
        () => {},
      );
    } catch {}
  }, []);

  const scrollComposerIntoView = useCallback(() => {
    const targetEl = composerAnchorRef.current ?? commentsSectionWrapRef.current;
    if (!targetEl) return;
    scrollTargetIntoView(targetEl);
  }, [scrollTargetIntoView]);

  const handleFocusCommentReady = useCallback(
    (target: View) => {
      runAfterDelays(FOCUS_COMMENT_DELAYS_MS, () => scrollTargetIntoView(target));
    },
    [scrollTargetIntoView],
  );

  const handleComposerFocus = useCallback(() => {
    if (isWeb) {
      scrollComposerIntoView();
      return;
    }
    runAfterDelays(COMPOSER_REFOCUS_DELAYS_MS, scrollComposerIntoView);
  }, [scrollComposerIntoView]);

  useEffect(() => {
    if (!visible || !recommendationId || scrollToCommentId || !scrollToComments) return;

    let cancelled = false;
    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      runAfterLayoutSettles(() => {
        if (cancelled) return;
        scrollComposerIntoView();
      });
    }, AUTO_SCROLL_TO_COMPOSER_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [visible, scrollToComments, scrollToCommentId, recommendationId, scrollComposerIntoView]);

  return {
    scrollRef,
    commentsSectionWrapRef,
    composerAnchorRef,
    handleFocusCommentReady,
    handleComposerFocus,
  };
}

export type CommentsScrollState = ReturnType<typeof useCommentsScroll>;
