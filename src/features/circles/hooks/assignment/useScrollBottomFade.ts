import { useCallback, useState } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const MIN_OVERFLOW_PX = 12;
const BOTTOM_EPSILON_PX = 8;

export function useScrollBottomFade() {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const showBottomFade =
    contentHeight > viewportHeight + MIN_OVERFLOW_PX &&
    scrollY < contentHeight - viewportHeight - BOTTOM_EPSILON_PX;

  const onLayout = (e: LayoutChangeEvent) => setViewportHeight(e.nativeEvent.layout.height);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setScrollY(e.nativeEvent.contentOffset.y);
  const onContentSizeChange = (_width: number, height: number) => setContentHeight(height);

  const reset = useCallback(() => {
    setViewportHeight(0);
    setContentHeight(0);
    setScrollY(0);
  }, []);

  return { showBottomFade, onLayout, onScroll, onContentSizeChange, reset };
}
