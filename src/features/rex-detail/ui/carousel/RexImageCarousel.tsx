import React, { useMemo, useState } from 'react';
import { View, FlatList, useWindowDimensions } from 'react-native';
import SignedStorageImage from '~/shared/ui/media/SignedStorageImage';
import { Skeleton } from '~/shared/ui/primitives/Skeleton';
import { CREATE_REC_MODAL_MAX_W } from '~/features/rex-create/config/layout';
import { REX_IMAGES_BUCKET } from '~/shared/config/app';
import { useInfiniteHorizontalCarousel } from '~/features/rex-detail/hooks/useInfiniteHorizontalCarousel';
import { cn } from '~/shared/lib/ui/styles';
import CarouselArrows from './common/CarouselArrows';
import CarouselDots from './common/CarouselDots';

const ASPECT = 16 / 9;
const HERO_H_PAD = 40;

function resolvePaths(paths: string[]) {
  return paths
    .map((p) => String(p ?? '').trim())
    .filter((p) => p && p !== 'null' && p !== 'undefined');
}

type Props = {
  paths: string[];
  className?: string;
  accessibilityLabelBase?: string;
};

function RexImageCarousel({ paths, className, accessibilityLabelBase = 'Photo' }: Props) {
  const { width: winW } = useWindowDimensions();
  const [measuredW, setMeasuredW] = useState(0);
  const itemWidth = useMemo(() => {
    if (measuredW > 0) return measuredW;
    return Math.max(1, Math.min(winW, CREATE_REC_MODAL_MAX_W) - HERO_H_PAD);
  }, [measuredW, winW]);
  const resolvedPaths = useMemo(() => resolvePaths(paths), [paths]);

  const {
    listRef,
    listData,
    isInfinite,
    count,
    realIndex,
    onScroll,
    onMomentumScrollEnd,
    onListContentSizeChange,
    getItemLayout,
    goToReal,
    listIndexToReal,
  } = useInfiniteHorizontalCarousel({ items: resolvedPaths, itemWidth });

  if (resolvedPaths.length === 0) {
    return (
      <View
        className={cn('w-full overflow-hidden rounded-xl', className)}
        style={{ aspectRatio: ASPECT }}
        accessibilityLabel="No photos"
        accessibilityRole="image"
      >
        <Skeleton className="h-full w-full rounded-xl bg-muted/40" />
      </View>
    );
  }

  if (resolvedPaths.length === 1) {
    return (
      <View
        className={cn('w-full overflow-hidden rounded-xl', className)}
        style={{ aspectRatio: ASPECT }}
      >
        <SignedStorageImage
          bucket={REX_IMAGES_BUCKET}
          storagePath={resolvedPaths[0]!}
          className="h-full w-full"
          contentFit="cover"
          skeletonUntilLoaded
          accessibilityLabel={accessibilityLabelBase}
        />
      </View>
    );
  }

  const itemH = itemWidth / ASPECT;

  return (
    <View
      className={cn('relative w-full', className)}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0) setMeasuredW(w);
      }}
    >
      <View className="overflow-hidden rounded-xl">
        <FlatList
          ref={listRef}
          data={listData}
          keyExtractor={(_, i) => `img-${i}`}
          style={{ width: '100%', height: itemH }}
          horizontal
          nestedScrollEnabled
          pagingEnabled
          removeClippedSubviews={false}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          getItemLayout={getItemLayout}
          onContentSizeChange={onListContentSizeChange}
          onScroll={onScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={({ item, index }) => {
            const photoNumber = (isInfinite ? listIndexToReal(index) : index) + 1;
            return (
              <View style={{ width: itemWidth, height: itemH }} className="overflow-hidden">
                <SignedStorageImage
                  bucket={REX_IMAGES_BUCKET}
                  storagePath={item}
                  className="h-full w-full"
                  contentFit="cover"
                  skeletonUntilLoaded
                  accessibilityLabel={`${accessibilityLabelBase} ${photoNumber} of ${count}`}
                />
              </View>
            );
          }}
        />
      </View>

      <CarouselArrows
        onPrev={() => goToReal(realIndex - 1)}
        onNext={() => goToReal(realIndex + 1)}
      />
      <CarouselDots count={count} activeIndex={realIndex} onSelect={goToReal} />
    </View>
  );
}

export default RexImageCarousel;
