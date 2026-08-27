import { useCallback, useState } from 'react';
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { profileGridLayout } from '~/features/profile/ui/ProfileGridCell';
import { useDiscoverCollectionsFeed } from '~/features/discover/hooks/useDiscoverCollectionsFeed';

const GRID_PAD = 16;
const NEAR_END_PX = 320;

export function useDiscoverCollectionsGrid() {
  const [searchQuery, setSearchQuery] = useState('');
  const feed = useDiscoverCollectionsFeed({ enabled: true });

  const { width: windowWidth } = useWindowDimensions();
  const [gridContentWidth, setGridContentWidth] = useState(() =>
    Math.max(windowWidth - GRID_PAD * 2, 1),
  );
  const { numColumns, gap } = profileGridLayout(gridContentWidth);

  const onGridLayout = useCallback((event: LayoutChangeEvent) => {
    const next = Math.floor(event.nativeEvent.layout.width);
    if (next <= 0) return;
    setGridContentWidth((prev) => (prev === next ? prev : next));
  }, []);

  const hasItems = feed.rows.length > 0;

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!hasItems) return;
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      if (layoutMeasurement.height + contentOffset.y < contentSize.height - NEAR_END_PX) return;
      feed.loadMore();
    },
    [hasItems, feed],
  );

  return {
    searchQuery,
    setSearchQuery,
    feed,
    hasItems,
    gridContentWidth,
    numColumns,
    gap,
    halfGap: gap / 2,
    onGridLayout,
    onScroll,
    gridPad: GRID_PAD,
  };
}

export type DiscoverCollectionsGridState = ReturnType<typeof useDiscoverCollectionsGrid>;
