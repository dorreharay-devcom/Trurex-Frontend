import React from 'react';
import { View, Pressable } from 'react-native';
import { cn } from '~/shared/lib/ui/styles';

type Props = {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

function CarouselDots({ count, activeIndex, onSelect }: Props) {
  return (
    <View
      className="absolute bottom-2.5 left-0 right-0 z-[11] items-center"
      pointerEvents="box-none"
    >
      <View
        className="flex-row items-center justify-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1.5"
        pointerEvents="box-none"
      >
        {Array.from({ length: count }, (_, i) => (
          <Pressable
            key={i}
            onPress={() => onSelect(i)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityState={{ selected: i === activeIndex }}
            accessibilityLabel={`Photo ${i + 1} of ${count}`}
          >
            <View
              className={cn(
                'rounded-full',
                i === activeIndex ? 'h-2 w-2 bg-primary' : 'h-1.5 w-1.5 bg-white/50',
              )}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default CarouselDots;
