import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { searchMentionCandidates } from '~/features/mentions/api/mentionsApi';
import {
  extractActiveMentionQuery,
  insertMentionIntoText,
  pruneStaleMentions,
} from '~/features/mentions/lib/mentionText';
import type { MentionCandidate, MentionRef } from '~/features/mentions/types/mention';
import { DEFAULT_SEARCH_DEBOUNCE_MS, useDebouncedValue } from '~/shared/hooks/useDebouncedValue';

const MENTION_PAGE_LIMIT = 8;

type Params = {
  text: string;
  setText: (value: string) => void;
};

export function useMentionAutocomplete({ text, setText }: Params) {
  const [taggedMentions, setTaggedMentions] = useState<MentionRef[]>([]);
  const [candidates, setCandidates] = useState<MentionCandidate[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const requestIdRef = useRef(0);

  const activeQuery = useMemo(() => extractActiveMentionQuery(text), [text]);
  const debouncedQuery = useDebouncedValue(activeQuery?.query ?? null, DEFAULT_SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    if (debouncedQuery === null) {
      setCandidates([]);
      setHasMore(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchMentionCandidates({ query: debouncedQuery, limit: MENTION_PAGE_LIMIT, offset: 0 })
      .then((results) => {
        if (requestIdRef.current !== requestId) return;
        setCandidates(results);
        setHasMore(results.length === MENTION_PAGE_LIMIT);
      })
      .catch(() => {
        if (requestIdRef.current !== requestId) return;
        setCandidates([]);
        setHasMore(false);
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setIsLoading(false);
      });
  }, [debouncedQuery]);

  const loadMore = useCallback(() => {
    if (debouncedQuery === null || !hasMore || isLoadingMore) return;
    const requestId = requestIdRef.current;

    setIsLoadingMore(true);
    searchMentionCandidates({
      query: debouncedQuery,
      limit: MENTION_PAGE_LIMIT,
      offset: candidates.length,
    })
      .then((results) => {
        if (requestIdRef.current !== requestId) return;
        setCandidates((prev) => [...prev, ...results]);
        setHasMore(results.length === MENTION_PAGE_LIMIT);
      })
      .catch(() => {
        if (requestIdRef.current !== requestId) return;
        setHasMore(false);
      })
      .finally(() => {
        if (requestIdRef.current === requestId) setIsLoadingMore(false);
      });
  }, [debouncedQuery, hasMore, isLoadingMore, candidates.length]);

  const showDropdown = activeQuery !== null && (candidates.length > 0 || isLoading);

  const selectMention = useCallback(
    (candidate: MentionCandidate) => {
      if (!activeQuery) return;
      setText(insertMentionIntoText(text, activeQuery.triggerIndex, candidate.handle));
      setTaggedMentions((prev) => {
        if (prev.some((ref) => ref.userId === candidate.userId)) return prev;
        return [...prev, { userId: candidate.userId, handle: candidate.handle }];
      });
    },
    [activeQuery, text, setText],
  );

  const resolveTaggedMentions = useCallback(
    (finalBody: string) => pruneStaleMentions(finalBody, taggedMentions),
    [taggedMentions],
  );

  const reset = useCallback(() => setTaggedMentions([]), []);

  return {
    showDropdown,
    candidates,
    isLoading,
    isLoadingMore,
    loadMore,
    selectMention,
    resolveTaggedMentions,
    reset,
  };
}

export type MentionAutocompleteState = ReturnType<typeof useMentionAutocomplete>;
