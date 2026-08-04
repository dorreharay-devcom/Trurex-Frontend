import React from 'react';
import { View, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react-native';
import { Theme } from '~/shared/theme/Theme';

type ArrowButtonProps = {
  icon: LucideIcon;
  accessibilityLabel: string;
  onPress: () => void;
};

function ArrowButton({ icon: Icon, accessibilityLabel, onPress }: ArrowButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="h-10 w-10 items-center justify-center rounded-full bg-black/50 active:bg-black/65"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Icon size={24} color={Theme.colors.white} />
    </Pressable>
  );
}

type Props = {
  onPrev: () => void;
  onNext: () => void;
};

function CarouselArrows({ onPrev, onNext }: Props) {
  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-0 z-10 flex-row items-center justify-between px-1"
      accessibilityRole="none"
    >
      <View>
        <ArrowButton icon={ChevronLeft} accessibilityLabel="Previous photo" onPress={onPrev} />
      </View>
      <View>
        <ArrowButton icon={ChevronRight} accessibilityLabel="Next photo" onPress={onNext} />
      </View>
    </View>
  );
}

export default CarouselArrows;
