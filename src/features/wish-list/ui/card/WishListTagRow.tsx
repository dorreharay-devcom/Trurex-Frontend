import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import {
  discoverOverflowLabel,
  DISCOVER_TAG_ROW_GAP,
  splitDiscoverTags,
  type DiscoverTagMeasurements,
} from '~/features/discover/lib/discoverTagLayout';
import TagChip from '~/features/discover/ui/feed/common/TagChip';
import { wishListTagLabel } from '~/features/wish-list/config/tags';

type Props = {
  tags: string[] | null | undefined;
};

const HIDDEN = { position: 'absolute' as const, opacity: 0, left: -10_000 };
const OVERFLOW_SAMPLES = [
  { digits: 1, label: '+9' },
  { digits: 2, label: '+99' },
  { digits: 3, label: '+999' },
] as const;

function TagMeasureLayer({
  tags,
  onMeasured,
}: {
  tags: readonly string[];
  onMeasured: (measurements: DiscoverTagMeasurements) => void;
}) {
  const tagWidthsRef = useRef<(number | undefined)[]>(Array.from({ length: tags.length }));
  const overflowWidthsRef = useRef<Partial<Record<number, number>>>({});
  const doneRef = useRef(false);

  const tryComplete = useCallback(() => {
    if (doneRef.current) return;

    const tagWidths = tagWidthsRef.current;
    if (tagWidths.length !== tags.length || tagWidths.some((width) => width === undefined)) return;
    if (!OVERFLOW_SAMPLES.every(({ digits }) => overflowWidthsRef.current[digits] !== undefined)) {
      return;
    }

    doneRef.current = true;
    onMeasured({
      tagWidths: tagWidths as number[],
      overflowWidthByDigits: overflowWidthsRef.current as Record<number, number>,
    });
  }, [onMeasured, tags.length]);

  return (
    <View pointerEvents="none" style={HIDDEN}>
      {tags.map((tag, index) => (
        <TagChip
          key={`${tag}-${index}`}
          label={wishListTagLabel(tag)}
          onLayout={(event) => {
            tagWidthsRef.current[index] = event.nativeEvent.layout.width;
            tryComplete();
          }}
        />
      ))}

      {OVERFLOW_SAMPLES.map(({ digits, label }) => (
        <TagChip
          key={label}
          label={label}
          onLayout={(event) => {
            overflowWidthsRef.current[digits] = event.nativeEvent.layout.width;
            tryComplete();
          }}
        />
      ))}
    </View>
  );
}

function WishListTagRowContent({ tags }: { tags: readonly string[] }) {
  const [rowWidth, setRowWidth] = useState(0);
  const [measurements, setMeasurements] = useState<DiscoverTagMeasurements | null>(null);

  const { visibleTags, hiddenCount } = useMemo(() => {
    if (rowWidth <= 0 || measurements == null) {
      return { visibleTags: [], hiddenCount: 0 };
    }
    return splitDiscoverTags(tags, measurements, rowWidth);
  }, [measurements, rowWidth, tags]);

  const ready = rowWidth > 0 && measurements != null;

  return (
    <View>
      {!ready && rowWidth > 0 ? <TagMeasureLayer tags={tags} onMeasured={setMeasurements} /> : null}

      <View
        className="flex-row flex-wrap"
        style={{ gap: DISCOVER_TAG_ROW_GAP }}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          if (width > 0) setRowWidth(width);
        }}
      >
        {ready
          ? visibleTags.map((tag, index) => (
              <TagChip key={`${tag}-${index}`} label={wishListTagLabel(tag)} />
            ))
          : null}
        {ready && hiddenCount > 0 ? <TagChip label={discoverOverflowLabel(hiddenCount)} /> : null}
      </View>
    </View>
  );
}

function WishListTagRow({ tags }: Props) {
  const items = tags ?? [];
  if (items.length === 0) return null;

  return <WishListTagRowContent key={items.join('\0')} tags={items} />;
}

export default WishListTagRow;
