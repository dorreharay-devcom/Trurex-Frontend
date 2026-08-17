import { useCallback, useEffect, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { FlashListRef } from '@shopify/flash-list';
import {
  getDiscoverScrollOffset,
  rememberDiscoverScrollOffset,
} from '~/features/discover/lib/discoverScrollMemory';

const SCROLL_TOP_THRESHOLD = 600;

type Options = {
  persistenceKey?: string;
  restoreWhen?: boolean;
};

export function useScrollTop<Item>(options: Options = {}) {
  const { persistenceKey, restoreWhen = true } = options;
  const listRef = useRef<FlashListRef<Item>>(null);
  const pendingRestoreRef = useRef(false);
  const [showScrollTop, setShowScrollTop] = useState(() =>
    persistenceKey ? getDiscoverScrollOffset(persistenceKey) > SCROLL_TOP_THRESHOLD : false,
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      if (persistenceKey) {
        rememberDiscoverScrollOffset(persistenceKey, offsetY);
      }
      const shouldShow = offsetY > SCROLL_TOP_THRESHOLD;
      setShowScrollTop((visible) => (visible === shouldShow ? visible : shouldShow));
    },
    [persistenceKey],
  );

  const scrollToTop = useCallback(() => {
    if (persistenceKey) {
      rememberDiscoverScrollOffset(persistenceKey, 0);
    }
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [persistenceKey]);

  const restoreScroll = useCallback(() => {
    if (!persistenceKey) return;
    const offsetY = getDiscoverScrollOffset(persistenceKey);
    if (offsetY <= 0) {
      pendingRestoreRef.current = false;
      return;
    }
    listRef.current?.scrollToOffset({ offset: offsetY, animated: false });
    setShowScrollTop(offsetY > SCROLL_TOP_THRESHOLD);
    pendingRestoreRef.current = false;
  }, [persistenceKey]);

  useFocusEffect(
    useCallback(() => {
      if (!persistenceKey) return;
      pendingRestoreRef.current = getDiscoverScrollOffset(persistenceKey) > 0;
      if (!pendingRestoreRef.current || !restoreWhen) return;
      const frame = requestAnimationFrame(() => restoreScroll());
      return () => cancelAnimationFrame(frame);
    }, [persistenceKey, restoreWhen, restoreScroll]),
  );

  useEffect(() => {
    if (!persistenceKey || !restoreWhen || !pendingRestoreRef.current) return;
    const frame = requestAnimationFrame(() => restoreScroll());
    return () => cancelAnimationFrame(frame);
  }, [persistenceKey, restoreWhen, restoreScroll]);

  return { listRef, showScrollTop, onScroll, scrollToTop };
}
