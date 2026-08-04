import { useCallback, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type { FlashListRef } from '@shopify/flash-list';

const SCROLL_TOP_THRESHOLD = 600;

export function useScrollTop<Item>() {
  const listRef = useRef<FlashListRef<Item>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const shouldShow = event.nativeEvent.contentOffset.y > SCROLL_TOP_THRESHOLD;
    setShowScrollTop((visible) => (visible === shouldShow ? visible : shouldShow));
  }, []);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  return { listRef, showScrollTop, onScroll, scrollToTop };
}
