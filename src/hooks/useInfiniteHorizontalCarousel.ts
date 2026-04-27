import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { FlatList, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';

function paddedIndexToReal(paddedIndex: number, count: number) {
  if (count <= 0) {
    return 0;
  }
  if (paddedIndex <= 0) {
    return count - 1;
  }
  if (paddedIndex >= count + 1) {
    return 0;
  }
  return paddedIndex - 1;
}

function buildPaddedList<T>(items: readonly T[]) {
  const n = items.length;
  if (n <= 1) {
    return { listData: [...items] as T[], isInfinite: false as const };
  }
  return {
    listData: [items[n - 1]!, ...items, items[0]!] as T[],
    isInfinite: true as const,
  };
}

function makeItemsKey<T>(items: readonly T[], getKey?: (items: readonly T[]) => string) {
  if (getKey) {
    return getKey(items);
  }
  if (items.length > 0 && typeof items[0] === 'string') {
    return (items as readonly string[]).join('\u0000');
  }
  return `len-${items.length}`;
}

type Options<T> = {
  items: readonly T[];
  itemWidth: number;
  getItemsKey?: (items: readonly T[]) => string;
};

type Result<T> = {
  listRef: RefObject<FlatList<T> | null>;
  listData: T[];
  isInfinite: boolean;
  count: number;
  realIndex: number;
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onMomentumScrollEnd: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onListContentSizeChange: () => void;
  getItemLayout:
    | undefined
    | ((
        data: ArrayLike<T> | null | undefined,
        index: number,
      ) => { length: number; offset: number; index: number });
  goToReal: (r: number) => void;
  listIndexToReal: (listIndex: number) => number;
};

export function useInfiniteHorizontalCarousel<T>({
  items,
  itemWidth,
  getItemsKey,
}: Options<T>): Result<T> {
  const listRef = useRef<FlatList<T>>(null);
  const jumpLock = useRef(false);
  const [realIndex, setRealIndex] = useState(0);

  const n = items.length;
  const { listData, isInfinite } = useMemo(() => buildPaddedList(items), [items]);
  const itemsKey = useMemo(
    () => makeItemsKey(items, getItemsKey),
    [items, getItemsKey],
  );

  const scrollIndexFromOffsetX = useCallback(
    (offsetX: number) => {
      if (itemWidth <= 0 || listData.length === 0) {
        return 0;
      }
      return Math.min(
        Math.max(0, Math.round(offsetX / itemWidth)),
        listData.length - 1,
      );
    },
    [itemWidth, listData.length],
  );

  const syncIndexFromOffset = useCallback(
    (offsetX: number) => {
      const listIdx = scrollIndexFromOffsetX(offsetX);
      if (!isInfinite) {
        setRealIndex(listIdx);
        return;
      }
      setRealIndex(paddedIndexToReal(listIdx, n));
    },
    [isInfinite, n, scrollIndexFromOffsetX],
  );

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (jumpLock.current) {
        return;
      }
      syncIndexFromOffset(e.nativeEvent.contentOffset.x);
    },
    [syncIndexFromOffset],
  );

  const onListContentSizeChange = useCallback(() => {
    if (itemWidth <= 0) return;
    if (!isInfinite) return;
    if (n < 2) return;
    const run = () => {
      listRef.current?.scrollToOffset({ offset: itemWidth, animated: false });
    };
    run();
    requestAnimationFrame(run);
  }, [isInfinite, itemWidth, n]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isInfinite || n < 2 || itemWidth <= 0) {
        return;
      }
      const i = scrollIndexFromOffsetX(e.nativeEvent.contentOffset.x);
      jumpLock.current = true;
      if (i === 0) {
        setRealIndex(n - 1);
        listRef.current?.scrollToOffset({ offset: n * itemWidth, animated: false });
        requestAnimationFrame(() => {
          jumpLock.current = false;
        });
        return;
      }
      if (i === n + 1) {
        setRealIndex(0);
        listRef.current?.scrollToOffset({ offset: itemWidth, animated: false });
        requestAnimationFrame(() => {
          jumpLock.current = false;
        });
        return;
      }
      setRealIndex(i - 1);
      requestAnimationFrame(() => {
        jumpLock.current = false;
      });
    },
    [isInfinite, n, scrollIndexFromOffsetX, itemWidth],
  );

  useEffect(() => {
    if (itemWidth <= 0) {
      return;
    }
    if (!isInfinite) {
      setRealIndex(0);
      return;
    }
    setRealIndex(0);
    const run = () => {
      listRef.current?.scrollToOffset({ offset: itemWidth, animated: false });
    };
    const t0 = setTimeout(run, 0);
    const t1 = setTimeout(run, 50);
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
    };
  }, [isInfinite, itemWidth, itemsKey]);

  const goToReal = useCallback(
    (r: number) => {
      if (n < 1 || itemWidth <= 0) {
        return;
      }
      const rClamped = ((r % n) + n) % n;
      setRealIndex(rClamped);
      const padded = isInfinite && n > 1 ? rClamped + 1 : rClamped;
      listRef.current?.scrollToOffset({ offset: padded * itemWidth, animated: true });
    },
    [n, isInfinite, itemWidth],
  );

  const listIndexToReal = useCallback(
    (listIndex: number) => paddedIndexToReal(listIndex, n),
    [n],
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<T> | null | undefined, index: number) => ({
      length: itemWidth,
      offset: itemWidth * index,
      index,
    }),
    [itemWidth],
  );

  return {
    listRef,
    listData,
    isInfinite,
    count: n,
    realIndex,
    onScroll,
    onMomentumScrollEnd,
    onListContentSizeChange,
    getItemLayout: itemWidth > 0 ? getItemLayout : undefined,
    goToReal,
    listIndexToReal,
  };
}
