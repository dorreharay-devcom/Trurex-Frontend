import React, { useMemo } from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { Globe, Heart, Lock, Users } from 'lucide-react-native';
import type { CreateRecCircle } from '~/constants/recommendation/createCircles';
import { Theme } from '~/theme/Theme';
import { cn } from '~/utils/general';
import { rgbaFromHexColor } from '~/utils/color';
import {
  RING_CENTER_DIAMETER,
  distanceFromInnerForRingId,
  ringCanvasSize,
  ringDiameterFns,
  ringPaintOrderBackToFront,
  selectionAnnuliLargestFirst,
} from '~/utils/recommendation/createCirclesRing';

const CHIP_ICON = 12;

function ChipGlyph({ circle: c }: { circle: CreateRecCircle }) {
  const color = c.accent;
  switch (c.iconKind) {
    case 'lock':
      return <Lock size={CHIP_ICON} color={color} />;
    case 'heart':
      return <Heart size={CHIP_ICON} color={color} />;
    case 'users':
      return <Users size={CHIP_ICON} color={color} />;
    case 'globe':
      return <Globe size={CHIP_ICON} color={color} />;
  }
}

type Props = {
  publicCircle: CreateRecCircle;
  ringsInnerToBroader: CreateRecCircle[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  highlightId: string;
  onHighlightId: (id: string) => void;
  editingId: string | null;
};

export function CirclesRingPicker({
  publicCircle,
  ringsInnerToBroader,
  selectedIds,
  onToggle,
  highlightId,
  onHighlightId,
  editingId,
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
    <View className="items-center">
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
                onHighlightId(ring.id);
                if (editingId == null) onToggle(ring.id);
              }}
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
                  <ChipGlyph circle={ring} />
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
