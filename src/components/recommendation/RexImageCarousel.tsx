import React, { useMemo, useState } from 'react';
import { View, FlatList, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { SignedStorageImage } from '~/components/common/SignedStorageImage';
import { REX_IMAGES_BUCKET } from '~/constants/storageBuckets';
import { useInfiniteHorizontalCarousel } from '~/hooks/useInfiniteHorizontalCarousel';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';

const ASPECT = 16 / 9;

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

export function RexImageCarousel({
  paths,
  className,
  accessibilityLabelBase = 'Photo',
}: Props) {
  const [itemWidth, setItemWidth] = useState(0);
  const resolvedPaths = useMemo(() => resolvePaths(paths), [paths]);

  const {
    listRef,
    listData,
    isInfinite,
    count,
    realIndex,
    onScroll,
    onMomentumScrollEnd,
    goToReal,
    listIndexToReal,
  } = useInfiniteHorizontalCarousel({ items: resolvedPaths, itemWidth });

  if (resolvedPaths.length === 0) {
    return (
      <View
        className={cn('aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted', className)}
        accessibilityLabel="No photos"
        accessibilityRole="image"
      />
    );
  }

  if (resolvedPaths.length === 1) {
    return (
      <View className={cn('w-full overflow-hidden rounded-xl', className)}>
        <SignedStorageImage
          bucket={REX_IMAGES_BUCKET}
          storagePath={resolvedPaths[0]!}
          className="aspect-[16/9] w-full"
          accessibilityLabel={accessibilityLabelBase}
        />
      </View>
    );
  }

  const itemH = itemWidth / ASPECT;

  return (
    <View
      className={cn('relative w-full', className)}
      onLayout={(e) => setItemWidth(e.nativeEvent.layout.width)}
    >
      <View className="overflow-hidden rounded-xl">
        {itemWidth > 0 && itemH > 0 ? (
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
            onScroll={onScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={({ item, index }) => {
              const displayLabel =
                isInfinite && count > 1
                  ? `${accessibilityLabelBase} ${listIndexToReal(index) + 1} of ${count}`
                  : `${accessibilityLabelBase} ${index + 1} of ${count}`;
              return (
                <View style={{ width: itemWidth, height: itemH }}>
                  <SignedStorageImage
                    bucket={REX_IMAGES_BUCKET}
                    storagePath={item}
                    className="h-full w-full"
                    accessibilityLabel={displayLabel}
                  />
                </View>
              );
            }}
          />
        ) : (
          <View
            className="aspect-[16/9] w-full bg-muted"
            accessibilityLabel="Preparing photos"
            accessibilityRole="image"
          />
        )}
      </View>

      <View
        className="pointer-events-none absolute inset-0 z-10 flex-row items-center justify-between px-1"
        accessibilityRole="none"
      >
        <View className="pointer-events-auto">
          <Pressable
            onPress={() => goToReal(realIndex - 1)}
            className="h-10 w-10 items-center justify-center rounded-full bg-black/50 active:bg-black/65"
            accessibilityRole="button"
            accessibilityLabel="Previous photo"
          >
            <ChevronLeft size={24} color={Theme.colors.white} />
          </Pressable>
        </View>
        <View className="pointer-events-auto">
          <Pressable
            onPress={() => goToReal(realIndex + 1)}
            className="h-10 w-10 items-center justify-center rounded-full bg-black/50 active:bg-black/65"
            accessibilityRole="button"
            accessibilityLabel="Next photo"
          >
            <ChevronRight size={24} color={Theme.colors.white} />
          </Pressable>
        </View>
      </View>

      <View
        className="absolute bottom-2.5 left-0 right-0 z-[11] items-center"
        pointerEvents="box-none"
      >
        <View
          className="flex-row items-center justify-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5"
          pointerEvents="box-none"
        >
          {resolvedPaths.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goToReal(i)}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityState={{ selected: i === realIndex }}
              accessibilityLabel={`Photo ${i + 1} of ${count}`}
            >
              <View
                className={cn(
                  'rounded-full',
                  i === realIndex ? 'h-2 w-2 bg-primary' : 'h-1.5 w-1.5 bg-white/50',
                )}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
