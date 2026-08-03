import React, { useMemo } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import type { CircleDisplayRow } from '~/shared/types/circles';
import { Theme } from '~/shared/theme/Theme';
import { cn } from '~/shared/lib/ui/styles';
import { rgbaFromHexColor } from '~/shared/lib/ui/color';
import {
  RING_CENTER_DIAMETER,
  distanceFromInnerForRingId,
  ringCanvasSize,
  ringDiameterFns,
  ringPaintOrderBackToFront,
  selectionAnnuliLargestFirst,
} from '~/features/rex-create/lib/circles';
import { CircleGlyph } from '~/features/circles/ui/CircleGlyph';

const CHIP_ICON = 12;

type Props = {
  publicCircle: CircleDisplayRow;
  ringsInnerToBroader: CircleDisplayRow[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  highlightId: string;
  onHighlightId: (id: string) => void;
  editingId: string | null;
  disabled?: boolean;
};

function CirclesRingPicker({
  publicCircle,
  ringsInnerToBroader,
  selectedIds,
  onToggle,
  highlightId,
  onHighlightId,
  editingId,
  disabled = false,
}: Props) {
  const { width: windowWidth } = useWindowDimensions();
  const canvas = ringCanvasSize(windowWidth);
  const ringCount = ringsInnerToBroader.length + 1;

  const { outerDiameter, innerHoleDiameter } = useMemo(
    () => ringDiameterFns(canvas, ringCount),
    [canvas, ringCount],
  );

  const paintOrder = useMemo(
    () => ringPaintOrderBackToFront(publicCircle, ringsInnerToBroader),
    [publicCircle, ringsInnerToBroader],
  );

  const annuli = useMemo(
    () =>
      selectionAnnuliLargestFirst(
        ringsInnerToBroader,
        publicCircle,
        selectedIds,
        outerDiameter,
        innerHoleDiameter,
        ringCount,
      ),
    [ringsInnerToBroader, publicCircle, selectedIds, outerDiameter, innerHoleDiameter, ringCount],
  );

  const cardBg = Theme.colors.card;

  return (
    <View className={cn('items-center', disabled && 'opacity-40')}>
      <View style={{ width: canvas, height: canvas }} className="relative">
        <View className="absolute inset-0" pointerEvents="none">
          {annuli.map(({ key, outer, inner, color }) => (
            <View
              key={`fill-${key}`}
              style={{
                position: 'absolute',
                width: outer,
                height: outer,
                borderRadius: outer / 2,
                top: (canvas - outer) / 2,
                left: (canvas - outer) / 2,
                backgroundColor: rgbaFromHexColor(color, 0.22),
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View
                style={{
                  width: inner,
                  height: inner,
                  borderRadius: inner / 2,
                  backgroundColor: cardBg,
                }}
              />
            </View>
          ))}
        </View>

        {paintOrder.map((ring) => {
          const dist = distanceFromInnerForRingId(
            ring.id,
            publicCircle,
            ringsInnerToBroader,
            ringCount,
          );
          const size = outerDiameter(dist);
          const offset = (canvas - size) / 2;
          const selected = selectedIds.has(ring.id);
          const highlighted = highlightId === ring.id;
          const borderAlpha = selected || highlighted ? 1 : 0.55;

          return (
            <Pressable
              key={ring.id}
              onPress={() => {
                if (disabled) return;
                onHighlightId(ring.id);
                if (editingId == null) onToggle(ring.id);
              }}
              disabled={disabled}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={ring.title}
              className="absolute justify-center rounded-full border-[3px] active:opacity-95"
              style={{
                width: size,
                height: size,
                top: offset,
                left: offset,
                borderColor: rgbaFromHexColor(ring.accent, borderAlpha),
                backgroundColor: 'transparent',
              }}
            >
              <View
                className="absolute left-0 right-0 items-center"
                style={{ top: -14 }}
                pointerEvents="none"
              >
                <View
                  className={cn(
                    'flex-row items-center gap-1 rounded-full border bg-card px-2 py-0.5 shadow-sm',
                  )}
                  style={{ borderColor: rgbaFromHexColor(ring.accent, 0.45) }}
                >
                  <CircleGlyph iconKind={ring.iconKind} color={ring.accent} size={CHIP_ICON} />
                  <Text
                    className="max-w-[140px] text-[11px] font-semibold"
                    style={{ color: ring.accent }}
                    numberOfLines={1}
                  >
                    {ring.title}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}

        <View
          className="absolute items-center justify-center rounded-full border-2 border-border bg-muted shadow-sm"
          style={{
            width: RING_CENTER_DIAMETER,
            height: RING_CENTER_DIAMETER,
            top: (canvas - RING_CENTER_DIAMETER) / 2,
            left: (canvas - RING_CENTER_DIAMETER) / 2,
          }}
          pointerEvents="none"
        >
          <Text className="text-2xl">👤</Text>
        </View>
      </View>
    </View>
  );
}

export default CirclesRingPicker;
